// Initialize default collection for a user
export const insertDefaultCollections = async (db, userId) => {
  await db.prepare(
    `INSERT OR IGNORE INTO collections (id, user_id, name, description, color) 
     VALUES ('starred', ?, 'Starred', 'Favorited problems', 'blue')`
  ).bind(userId).run();
};
