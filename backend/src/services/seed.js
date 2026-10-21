import { hashPassword } from '../utils/crypto.js';

// Initialize default collection for a user
export const insertDefaultCollections = async (db, userId) => {
  await db.prepare(
    `INSERT OR IGNORE INTO collections (id, user_id, name, description, color) 
     VALUES ('starred', ?, 'Starred', 'Favorited problems', 'blue')`
  ).bind(userId).run();
};

// Ensure a clean guest account exists (0 dummy problems)
export const ensureGuestSeeded = async (db) => {
  const existingGuest = await db.prepare(
    `SELECT * FROM users WHERE username = 'guest'`
  ).first();

  if (existingGuest) return existingGuest;

  const guestId = crypto.randomUUID();
  const hashedPassword = await hashPassword('guest_session_pass_2026');

  // Insert guest user
  await db.prepare(
    `INSERT INTO users (id, username, password, name) VALUES (?, 'guest', ?, 'Guest')`
  ).bind(guestId, hashedPassword).run();

  // Create default Starred collection
  await insertDefaultCollections(db, guestId);

  return {
    id: guestId,
    username: 'guest',
    name: 'Guest',
  };
};

// Reset guest profile after syncing data to a real registered user
export const resetGuestProfile = async (db, guestId) => {
  const statements = [
    db.prepare(`DELETE FROM problems WHERE user_id = ?`).bind(guestId),
    db.prepare(`DELETE FROM collections WHERE user_id = ?`).bind(guestId),
    db.prepare(`DELETE FROM user_activity WHERE user_id = ?`).bind(guestId),
  ];
  await db.batch(statements);

  // Re-insert only default Starred collection
  await insertDefaultCollections(db, guestId);
};
