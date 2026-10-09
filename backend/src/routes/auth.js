import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import { hashPassword, comparePassword, createToken } from '../utils/crypto.js';
import { today, fetchUserActivityMap } from '../utils/db.js';
import {
  ensureGuestSeeded,
  insertSeedProblemsAndCollections,
  resetGuestProfile,
} from '../services/seed.js';

const authRoutes = new Hono();

// POST /register
authRoutes.post('/register', async (c) => {
  try {
    const db = c.env.DB;
    const jwtSecret = c.env.JWT_SECRET || 'dsa_tracker_jwt_secret_edge_key_secure_2026';
    const { username, password, name } = await c.req.json();

    if (!username || !password || !name) {
      return c.json({ message: 'Please enter all fields.' }, 400);
    }
    if (name.trim().length > 20) {
      return c.json({ message: 'Display Name cannot exceed 20 characters.' }, 400);
    }
    if (username.trim().length > 20) {
      return c.json({ message: 'Username cannot exceed 20 characters.' }, 400);
    }
    if (password.length > 10) {
      return c.json({ message: 'Password cannot exceed 10 characters.' }, 400);
    }
    if (password.length < 4) {
      return c.json({ message: 'Password must be at least 4 characters long.' }, 400);
    }

    const cleanUsername = username.toLowerCase().trim();
    const existingUser = await db.prepare(
      `SELECT id FROM users WHERE username = ?`
    ).bind(cleanUsername).first();

    if (existingUser) {
      return c.json({ message: 'Username already exists.' }, 400);
    }

    const userId = crypto.randomUUID();
    const hashedPassword = await hashPassword(password);

    await db.prepare(
      `INSERT INTO users (id, username, password, name) VALUES (?, ?, ?, ?)`
    ).bind(userId, cleanUsername, hashedPassword, name.trim()).run();

    // Create default collections (only Starred)
    await db.prepare(
      `INSERT OR IGNORE INTO collections (id, user_id, name, description, color) VALUES ('starred', ?, 'Starred', 'Favorited problems', 'blue')`
    ).bind(userId).run();

    const token = await createToken({ id: userId }, jwtSecret);
    return c.json({
      token,
      user: {
        id: userId,
        _id: userId,
        username: cleanUsername,
        name: name.trim(),
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
    const jwtSecret = c.env.JWT_SECRET || 'dsa_tracker_jwt_secret_edge_key_secure_2026';
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ message: 'Please enter all fields.' }, 400);
    }
    if (username.length > 20 || password.length > 10) {
      return c.json({ message: 'Invalid credentials. Username max 20, password max 10 characters.' }, 400);
    }

    const cleanUsername = username.toLowerCase().trim();
    const user = await db.prepare(
      `SELECT * FROM users WHERE username = ?`
    ).bind(cleanUsername).first();

    if (!user) {
      return c.json({ message: 'No account with this username has been registered.' }, 400);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return c.json({ message: 'Invalid credentials.' }, 400);
    }

    // Auto-seed check if user has zero problems
    const probCount = await db.prepare(
      `SELECT COUNT(*) as count FROM problems WHERE user_id = ?`
    ).bind(user.id).first('count');

    if (Number(probCount) === 0) {
      await insertSeedProblemsAndCollections(db, user.id);
    }

    const activity = await fetchUserActivityMap(db, user.id);
    const token = await createToken({ id: user.id }, jwtSecret);

    return c.json({
      token,
      user: {
        id: user.id,
        _id: user.id,
        username: user.username,
        name: user.name,
        activity,
      },
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /guest-login
authRoutes.post('/guest-login', async (c) => {
  try {
    const db = c.env.DB;
    const jwtSecret = c.env.JWT_SECRET || 'dsa_tracker_jwt_secret_edge_key_secure_2026';

    const guestUser = await ensureGuestSeeded(db);
    const activity = await fetchUserActivityMap(db, guestUser.id);
    const token = await createToken({ id: guestUser.id }, jwtSecret);

    return c.json({
      token,
      user: {
        id: guestUser.id,
        _id: guestUser.id,
        username: guestUser.username,
        name: guestUser.name,
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

    const user = await db.prepare(
      `SELECT id, username, name FROM users WHERE id = ?`
    ).bind(userId).first();

    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    const activity = await fetchUserActivityMap(db, userId);

    return c.json({
      id: user.id,
      _id: user.id,
      username: user.username,
      name: user.name,
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
    const jwtSecret = c.env.JWT_SECRET || 'dsa_tracker_jwt_secret_edge_key_secure_2026';
    const userId = c.get('userId');
    const { name, username, password } = await c.req.json();

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
    let updatedPassword = user.password;

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

    if (password && password.trim()) {
      if (password.trim().length < 4 || password.trim().length > 10) {
        return c.json({ message: 'Password must be between 4 and 10 characters.' }, 400);
      }
      updatedPassword = await hashPassword(password.trim());
    }

    await db.prepare(
      `UPDATE users SET name = ?, username = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(updatedName, updatedUsername, updatedPassword, userId).run();

    const activity = await fetchUserActivityMap(db, userId);
    const token = await createToken({ id: userId }, jwtSecret);

    return c.json({
      token,
      user: {
        id: userId,
        _id: userId,
        username: updatedUsername,
        name: updatedName,
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

    const guestUser = await db.prepare(
      `SELECT * FROM users WHERE username = 'guest'`
    ).first();

    if (!guestUser) {
      return c.json({ message: 'Guest profile not found.' }, 404);
    }

    if (guestUser.id === targetUserId) {
      return c.json({ message: 'Cannot sync guest to guest profile.' }, 400);
    }

    // 1. Move custom collections from guest to target user
    const defaultIds = ['starred', 'blind75', 'top150'];
    await db.prepare(
      `UPDATE collections SET user_id = ? 
       WHERE user_id = ? AND id NOT IN ('starred', 'blind75', 'top150')`
    ).bind(targetUserId, guestUser.id).run();

    // 2. Move problems from guest to target user
    await db.prepare(
      `UPDATE problems SET user_id = ? WHERE user_id = ?`
    ).bind(targetUserId, guestUser.id).run();

    // 3. Merge activity from guest to target user
    const guestActivity = await db.prepare(
      `SELECT date, count FROM user_activity WHERE user_id = ?`
    ).bind(guestUser.id).all();

    for (const row of (guestActivity.results || [])) {
      await db.prepare(
        `INSERT INTO user_activity (user_id, date, count) 
         VALUES (?, ?, ?) 
         ON CONFLICT(user_id, date) DO UPDATE SET count = count + ?`
      ).bind(targetUserId, row.date, row.count, row.count).run();
    }

    // 4. Reset guest profile in database for next guest sessions
    await resetGuestProfile(db, guestUser.id);

    return c.json({ message: 'Guest data successfully migrated to user profile.' });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

export default authRoutes;
