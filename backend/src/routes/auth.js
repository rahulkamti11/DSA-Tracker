import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import { hashPassword, comparePassword, createToken, getJwtSecret } from '../utils/crypto.js';
import { today, fetchUserActivityMap } from '../utils/db.js';
import { insertDefaultCollections } from '../services/seed.js';

const authRoutes = new Hono();

// Helper to validate email format
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim().toLowerCase());
}

// POST /register - Registration does NOT ask for gender or avatar (low-friction onboarding)
authRoutes.post('/register', async (c) => {
  try {
    const db = c.env.DB;
    const jwtSecret = getJwtSecret(c.env);
    const { username, email, password, name } = await c.req.json();

    if (!username || !email || !password || !name) {
      return c.json({ message: 'Please enter all fields (Name, Email, Username, Password).' }, 400);
    }
    if (name.trim().length > 20) {
      return c.json({ message: 'Display Name cannot exceed 20 characters.' }, 400);
    }
    if (username.trim().length > 20) {
      return c.json({ message: 'Username cannot exceed 20 characters.' }, 400);
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail) || cleanEmail.length > 50) {
      return c.json({ message: 'Please enter a valid email address (max 50 chars).' }, 400);
    }
    if (password.length > 72) {
      return c.json({ message: 'Password cannot exceed 72 characters.' }, 400);
    }
    if (password.length < 4) {
      return c.json({ message: 'Password must be at least 4 characters long.' }, 400);
    }

    const cleanUsername = username.toLowerCase().trim();
    
    // Check if username already exists
    const existingUser = await db.prepare(
      `SELECT id FROM users WHERE username = ?`
    ).bind(cleanUsername).first();

    if (existingUser) {
      return c.json({ message: 'Username already exists.' }, 400);
    }

    // Check if email already exists
    const existingEmail = await db.prepare(
      `SELECT id FROM users WHERE email = ?`
    ).bind(cleanEmail).first();

    if (existingEmail) {
      return c.json({ message: 'Email is already registered. Please log in.' }, 400);
    }

    const userId = crypto.randomUUID();
    const hashedPassword = await hashPassword(password);
    const defaultGender = 'prefer_not_to_say';
    const defaultAvatar = 'ninja';

    try {
      await db.prepare(
        `INSERT INTO users (id, username, email, password, name, gender, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(userId, cleanUsername, cleanEmail, hashedPassword, name.trim(), defaultGender, defaultAvatar).run();
    } catch {
      // Fallback for database before migration
      await db.prepare(
        `INSERT INTO users (id, username, email, password, name) VALUES (?, ?, ?, ?, ?)`
      ).bind(userId, cleanUsername, cleanEmail, hashedPassword, name.trim()).run();
    }

    // Create default collections (only Starred)
    await insertDefaultCollections(db, userId);

    const token = await createToken({ id: userId }, jwtSecret);
    return c.json({
      token,
      user: {
        id: userId,
        _id: userId,
        username: cleanUsername,
        email: cleanEmail,
        name: name.trim(),
        gender: defaultGender,
        avatar: defaultAvatar,
      },
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /login
authRoutes.post('/login', async (c) => {
  try {
    const db = c.env.DB;
    const jwtSecret = getJwtSecret(c.env);
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ message: 'Please enter all fields.' }, 400);
    }
    if (username.length > 50 || password.length > 72) {
      return c.json({ message: 'Invalid credentials. Username/email max 50, password max 72 characters.' }, 400);
    }

    const cleanIdentifier = username.toLowerCase().trim();
    // Allow login by Username OR Email
    const user = await db.prepare(
      `SELECT * FROM users WHERE username = ? OR email = ?`
    ).bind(cleanIdentifier, cleanIdentifier).first();

    if (!user) {
      return c.json({ message: 'No account found with this username or email.' }, 400);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return c.json({ message: 'Invalid credentials.' }, 400);
    }

    const activity = await fetchUserActivityMap(db, user.id);
    const token = await createToken({ id: user.id }, jwtSecret);

    return c.json({
      token,
      user: {
        id: user.id,
        _id: user.id,
        username: user.username,
        email: user.email || '',
        name: user.name,
        gender: user.gender || 'prefer_not_to_say',
        avatar: user.avatar || 'ninja',
        activity,
      },
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /me
authRoutes.get('/me', authMiddleware, async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');

    let user;
    try {
      user = await db.prepare(
        `SELECT id, username, email, name, gender, avatar FROM users WHERE id = ?`
      ).bind(userId).first();
    } catch {
      user = await db.prepare(
        `SELECT id, username, email, name FROM users WHERE id = ?`
      ).bind(userId).first();
    }

    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    const activity = await fetchUserActivityMap(db, userId);

    return c.json({
      id: user.id,
      _id: user.id,
      username: user.username,
      email: user.email || '',
      name: user.name,
      gender: user.gender || 'prefer_not_to_say',
      avatar: user.avatar || 'ninja',
      activity,
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// PUT /me
authRoutes.put('/me', authMiddleware, async (c) => {
  try {
    const db = c.env.DB;
    const jwtSecret = getJwtSecret(c.env);
    const userId = c.get('userId');
    const { name, username, password, email, gender, avatar } = await c.req.json();

    const user = await db.prepare(
      `SELECT * FROM users WHERE id = ?`
    ).bind(userId).first();

    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    if (user.username === 'guest') {
      return c.json({ message: 'Guest profile cannot be modified. Please log in or register an account.' }, 403);
    }

    let updatedName = user.name;
    let updatedUsername = user.username;
    let updatedEmail = user.email || '';
    let updatedPassword = user.password;
    let updatedGender = user.gender || 'prefer_not_to_say';
    let updatedAvatar = user.avatar || 'ninja';

    if (name && name.trim()) {
      if (name.trim().length > 20) {
        return c.json({ message: 'Display Name cannot exceed 20 characters.' }, 400);
      }
      updatedName = name.trim();
    }

    if (username && username.trim() && username.toLowerCase().trim() !== user.username) {
      const cleanUser = username.toLowerCase().trim();
      if (cleanUser.length > 20) {
        return c.json({ message: 'Username cannot exceed 20 characters.' }, 400);
      }

      const existing = await db.prepare(
        `SELECT id FROM users WHERE username = ? AND id != ?`
      ).bind(cleanUser, userId).first();

      if (existing) {
        return c.json({ message: 'Username is already taken by another account.' }, 400);
      }
      updatedUsername = cleanUser;
    }

    if (email && email.trim() && email.toLowerCase().trim() !== (user.email || '').toLowerCase()) {
      const cleanEmail = email.toLowerCase().trim();
      if (!isValidEmail(cleanEmail) || cleanEmail.length > 50) {
        return c.json({ message: 'Please enter a valid email address (max 50 chars).' }, 400);
      }
      const existingEmail = await db.prepare(
        `SELECT id FROM users WHERE email = ? AND id != ?`
      ).bind(cleanEmail, userId).first();
      if (existingEmail) {
        return c.json({ message: 'Email is already in use by another account.' }, 400);
      }
      updatedEmail = cleanEmail;
    }

    if (password && password.trim()) {
      if (password.trim().length < 4 || password.trim().length > 72) {
        return c.json({ message: 'Password must be between 4 and 72 characters.' }, 400);
      }
      updatedPassword = await hashPassword(password.trim());
    }

    if (gender !== undefined) {
      const validGenders = ['male', 'female', 'other', 'prefer_not_to_say', ''];
      if (validGenders.includes(gender)) {
        updatedGender = gender;
      }
    }

    if (avatar && typeof avatar === 'string' && avatar.trim().length <= 50) {
      updatedAvatar = avatar.trim();
    }

    try {
      await db.prepare(
        `UPDATE users SET name = ?, username = ?, email = ?, password = ?, gender = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      ).bind(updatedName, updatedUsername, updatedEmail, updatedPassword, updatedGender, updatedAvatar, userId).run();
    } catch {
      // Fallback for pre-migration schema
      await db.prepare(
        `UPDATE users SET name = ?, username = ?, email = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      ).bind(updatedName, updatedUsername, updatedEmail, updatedPassword, userId).run();
    }

    const activity = await fetchUserActivityMap(db, userId);
    const token = await createToken({ id: userId }, jwtSecret);

    return c.json({
      token,
      user: {
        id: userId,
        _id: userId,
        username: updatedUsername,
        email: updatedEmail,
        name: updatedName,
        gender: updatedGender,
        avatar: updatedAvatar,
        activity,
      },
      message: 'Profile updated successfully.',
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /activity
authRoutes.post('/activity', authMiddleware, async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');
    const dateKey = today();

    await db.prepare(
      `INSERT INTO user_activity (user_id, date, count) 
       VALUES (?, ?, 1) 
       ON CONFLICT(user_id, date) DO UPDATE SET count = count + 1`
    ).bind(userId, dateKey).run();

    const activity = await fetchUserActivityMap(db, userId);
    return c.json(activity);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /sync
authRoutes.post('/sync', authMiddleware, async (c) => {
  try {
    const db = c.env.DB;
    const targetUserId = c.get('userId');
    const clientPayload = await c.req.json().catch(() => ({}));

    // 1. If client provided localStorage offline collections, insert them
    if (Array.isArray(clientPayload.collections)) {
      for (const col of clientPayload.collections) {
        if (col && col.id && col.name && col.id !== 'starred') {
          await db.prepare(
            `INSERT OR IGNORE INTO collections (id, user_id, name, description, color) VALUES (?, ?, ?, ?, ?)`
          ).bind(col.id, targetUserId, col.name.trim(), (col.description || '').trim(), col.color || 'blue').run();
        }
      }
    }

    // 2. If client provided localStorage offline problems, insert them
    const problemsToSync = [
      ...(Array.isArray(clientPayload.problems) ? clientPayload.problems : []),
      ...(Array.isArray(clientPayload.trash) ? clientPayload.trash.map(p => ({ ...p, isDeleted: true })) : [])
    ];

    for (const prob of problemsToSync) {
      if (prob && prob.name && prob.name.trim()) {
        const probId = prob.id || prob._id || crypto.randomUUID();
        const collList = Array.isArray(prob.collections) && prob.collections.length > 0
          ? prob.collections.filter(Boolean)
          : (prob.collId ? [prob.collId] : []);
        const primaryColl = collList.length > 0 ? collList[0] : (prob.collId || '');

        await db.prepare(
          `INSERT OR IGNORE INTO problems (
            id, user_id, name, diff, status, coll_id, starred, notes, code, language,
            date, interval, next_rev, rev_count, no_rep, last_reviewed, solved_date,
            mastered_date, is_deleted, del_date
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          probId,
          targetUserId,
          prob.name.trim(),
          prob.diff || 'Medium',
          prob.status || 'Solved',
          primaryColl,
          prob.starred ? 1 : 0,
          prob.notes || '',
          prob.code || '',
          prob.language || 'cpp',
          prob.date || today(),
          prob.interval ?? 1,
          prob.nextRev || null,
          prob.revCount ?? 0,
          prob.noRep ? 1 : 0,
          prob.lastReviewed || null,
          prob.solvedDate || null,
          prob.masteredDate || null,
          prob.isDeleted ? 1 : 0,
          prob.delDate || null
        ).run();

        // Sync into dedicated problem_collections junction table
        for (const cid of collList) {
          if (cid) {
            await db.prepare(
              `INSERT OR IGNORE INTO problem_collections (problem_id, collection_id, user_id) VALUES (?, ?, ?)`
            ).bind(probId, cid, targetUserId).run().catch(() => {});
          }
        }

        if (Array.isArray(prob.tags)) {
          for (const tag of prob.tags) {
            if (tag && typeof tag === 'string') {
              await db.prepare(
                `INSERT OR IGNORE INTO problem_tags (problem_id, tag) VALUES (?, ?)`
              ).bind(probId, tag.trim()).run();
            }
          }
        }

        if (Array.isArray(prob.platforms)) {
          for (const pl of prob.platforms) {
            if (pl && pl.platform && pl.url) {
              await db.prepare(
                `INSERT OR IGNORE INTO problem_platforms (problem_id, platform, url) VALUES (?, ?, ?)`
              ).bind(probId, pl.platform, pl.url).run();
            }
          }
        }
      }
    }

    // 3. If client provided offline activity map, merge it
    if (clientPayload.activity && typeof clientPayload.activity === 'object') {
      for (const [dateKey, countVal] of Object.entries(clientPayload.activity)) {
        if (Number.isInteger(countVal) && countVal > 0) {
          await db.prepare(
            `INSERT INTO user_activity (user_id, date, count) 
             VALUES (?, ?, ?) 
             ON CONFLICT(user_id, date) DO UPDATE SET count = count + ?`
          ).bind(targetUserId, dateKey, countVal, countVal).run();
        }
      }
    }

    // 4. Clean up any legacy database guest account if present
    const legacyGuest = await db.prepare(`SELECT id FROM users WHERE username = 'guest'`).first();
    if (legacyGuest) {
      await db.prepare(`DELETE FROM problems WHERE user_id = ?`).bind(legacyGuest.id).run();
      await db.prepare(`DELETE FROM collections WHERE user_id = ?`).bind(legacyGuest.id).run();
      await db.prepare(`DELETE FROM user_activity WHERE user_id = ?`).bind(legacyGuest.id).run();
      await db.prepare(`DELETE FROM users WHERE id = ?`).bind(legacyGuest.id).run();
      await db.prepare(`DELETE FROM problem_collections WHERE user_id = ?`).bind(legacyGuest.id).run().catch(() => {});
    }

    return c.json({ message: 'Guest data successfully migrated to user profile.' });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// DELETE /me (Right to be Forgotten / Data Compliance)
authRoutes.delete('/me', authMiddleware, async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');

    const user = await db.prepare(
      `SELECT * FROM users WHERE id = ?`
    ).bind(userId).first();

    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    if (user.username === 'guest') {
      return c.json({ message: 'Guest account cannot be deleted.' }, 403);
    }

    // Comprehensive cascading deletion across all relational tables
    await db.batch([
      db.prepare(`DELETE FROM problem_tags WHERE problem_id IN (SELECT id FROM problems WHERE user_id = ?)`).bind(userId),
      db.prepare(`DELETE FROM problem_platforms WHERE problem_id IN (SELECT id FROM problems WHERE user_id = ?)`).bind(userId),
      db.prepare(`DELETE FROM problem_reviews WHERE user_id = ?`).bind(userId),
      db.prepare(`DELETE FROM problem_collections WHERE user_id = ?`).bind(userId),
      db.prepare(`DELETE FROM problems WHERE user_id = ?`).bind(userId),
      db.prepare(`DELETE FROM collections WHERE user_id = ?`).bind(userId),
      db.prepare(`DELETE FROM user_activity WHERE user_id = ?`).bind(userId),
      db.prepare(`DELETE FROM feedback WHERE user_id = ?`).bind(userId),
      db.prepare(`DELETE FROM bug_reports WHERE user_id = ?`).bind(userId),
      db.prepare(`DELETE FROM users WHERE id = ?`).bind(userId),
    ]);

    return c.json({ message: 'Your account and all associated data have been permanently deleted.' });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

export default authRoutes;
