import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';

const collectionsRoutes = new Hono();

collectionsRoutes.use('*', authMiddleware);

// GET / - Get all collections for the user
collectionsRoutes.get('/', async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');

    const collections = await db.prepare(
      `SELECT id, user_id, name, description, color, created_at 
       FROM collections 
       WHERE user_id = ? 
       ORDER BY created_at ASC`
    ).bind(userId).all();

    return c.json(collections.results || []);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// POST / - Create a new collection
collectionsRoutes.post('/', async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');
    const { id, name, description = '', color = 'blue' } = await c.req.json();

    if (!id || !name) {
      return c.json({ message: 'Collection ID and name are required.' }, 400);
    }

    await db.prepare(
      `INSERT INTO collections (id, user_id, name, description, color) 
       VALUES (?, ?, ?, ?, ?)`
    ).bind(id, userId, name.trim(), description.trim(), color).run();

    const created = await db.prepare(
      `SELECT id, user_id, name, description, color, created_at 
       FROM collections 
       WHERE id = ? AND user_id = ?`
    ).bind(id, userId).first();

    return c.json(created);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// PUT /:id - Update collection name
collectionsRoutes.put('/:id', async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');
    const id = c.req.param('id');
    const { name } = await c.req.json();

    if (!name || !name.trim()) {
      return c.json({ message: 'Collection name is required.' }, 400);
    }

    const res = await db.prepare(
      `UPDATE collections SET name = ? WHERE id = ? AND user_id = ?`
    ).bind(name.trim(), id, userId).run();

    if (res.meta && res.meta.changes === 0) {
      return c.json({ message: 'Collection not found or unauthorized' }, 404);
    }

    const updated = await db.prepare(
      `SELECT id, user_id, name, description, color, created_at 
       FROM collections 
       WHERE id = ? AND user_id = ?`
    ).bind(id, userId).first();

    return c.json(updated);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// DELETE /:id - Delete collection and reset problems' collId
collectionsRoutes.delete('/:id', async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');
    const id = c.req.param('id');

    const statements = [
      db.prepare(`DELETE FROM collections WHERE id = ? AND user_id = ?`).bind(id, userId),
      db.prepare(`UPDATE problems SET coll_id = '' WHERE user_id = ? AND coll_id = ?`).bind(userId, id),
    ];

    await db.batch(statements);

    return c.json({ message: 'Collection deleted successfully', id });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

export default collectionsRoutes;
