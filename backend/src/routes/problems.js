import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import {
  today,
  fetchHydratedProblems,
  fetchSingleHydratedProblem,
} from '../utils/db.js';

const problemsRoutes = new Hono();

problemsRoutes.use('*', authMiddleware);

// GET / - Get active problems
problemsRoutes.get('/', async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');
    const problems = await fetchHydratedProblems(db, userId, 0);
    return c.json(problems);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /trash - Get soft-deleted problems
problemsRoutes.get('/trash', async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');
    const trash = await fetchHydratedProblems(db, userId, 1);
    return c.json(trash);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /:id/reviews - Optional history endpoint for review timeline
problemsRoutes.get('/:id/reviews', async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');
    const problemId = c.req.param('id');

    const reviews = await db.prepare(
      `SELECT * FROM problem_reviews WHERE problem_id = ? AND user_id = ? ORDER BY created_at DESC`
    ).bind(problemId, userId).all();

    return c.json(reviews.results || []);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// POST / - Create a problem
problemsRoutes.post('/', async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');
    const body = await c.req.json();

    const {
      name,
      diff = 'Medium',
      status = 'Solved',
      tags = [],
      collId = '',
      starred = false,
      notes = '',
      platforms = [],
      date = today(),
      interval = 1,
      nextRev = null,
      revCount = 0,
      noRep = false,
      lastReviewed = null,
      solvedDate = null,
      masteredDate = null,
      code = '',
      language = 'cpp',
    } = body;

    if (!name || !name.trim()) {
      return c.json({ message: 'Problem name is required.' }, 400);
    }

    const problemId = body.id || crypto.randomUUID();

    const statements = [
      db.prepare(
        `INSERT INTO problems (
          id, user_id, name, diff, status, coll_id, starred, notes, code, language,
          date, interval, next_rev, rev_count, no_rep, last_reviewed, solved_date,
          mastered_date, is_deleted, del_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL)`
      ).bind(
        problemId,
        userId,
        name.trim(),
        diff,
        status,
        collId || '',
        starred ? 1 : 0,
        notes || '',
        code || '',
        language || 'cpp',
        date,
        interval ?? 1,
        nextRev || null,
        revCount ?? 0,
        noRep ? 1 : 0,
        lastReviewed || null,
        solvedDate || (status === 'Solved' ? date : null),
        masteredDate || (status === 'Mastered' ? date : null)
      ),
    ];

    // Tags
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (tag && typeof tag === 'string') {
          statements.push(
            db.prepare(
              `INSERT OR IGNORE INTO problem_tags (problem_id, tag) VALUES (?, ?)`
            ).bind(problemId, tag.trim())
          );
        }
      }
    }

    // Platforms
    if (Array.isArray(platforms)) {
      for (const pl of platforms) {
        if (pl && pl.platform && pl.url) {
          statements.push(
            db.prepare(
              `INSERT INTO problem_platforms (id, problem_id, platform, url) VALUES (?, ?, ?, ?)`
            ).bind(crypto.randomUUID(), problemId, pl.platform, pl.url)
          );
        }
      }
    }

    // Initial review log entry if revCount > 0
    if (revCount > 0) {
      statements.push(
        db.prepare(
          `INSERT INTO problem_reviews (id, problem_id, user_id, review_date, interval, status) 
           VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(crypto.randomUUID(), problemId, userId, date, interval ?? 1, status)
      );
    }

    await db.batch(statements);

    const savedProblem = await fetchSingleHydratedProblem(db, problemId, userId);
    return c.json(savedProblem);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// PUT /:id - Update a problem
problemsRoutes.put('/:id', async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');
    const problemId = c.req.param('id');
    const body = await c.req.json();

    const existing = await db.prepare(
      `SELECT * FROM problems WHERE id = ? AND user_id = ?`
    ).bind(problemId, userId).first();

    if (!existing) {
      return c.json({ message: 'Problem not found or unauthorized' }, 404);
    }

    const statements = [];

    // Fields to update
    const updated = {
      name: body.name !== undefined ? body.name : existing.name,
      diff: body.diff !== undefined ? body.diff : existing.diff,
      status: body.status !== undefined ? body.status : existing.status,
      coll_id: body.collId !== undefined ? body.collId : existing.coll_id,
      starred: body.starred !== undefined ? (body.starred ? 1 : 0) : existing.starred,
      notes: body.notes !== undefined ? body.notes : existing.notes,
      code: body.code !== undefined ? body.code : existing.code,
      language: body.language !== undefined ? body.language : existing.language,
      date: body.date !== undefined ? body.date : existing.date,
      interval: body.interval !== undefined ? body.interval : existing.interval,
      next_rev: body.nextRev !== undefined ? body.nextRev : existing.next_rev,
      rev_count: body.revCount !== undefined ? body.revCount : existing.rev_count,
      no_rep: body.noRep !== undefined ? (body.noRep ? 1 : 0) : existing.no_rep,
      last_reviewed: body.lastReviewed !== undefined ? body.lastReviewed : existing.last_reviewed,
      solved_date: body.solvedDate !== undefined ? body.solvedDate : existing.solved_date,
      mastered_date: body.masteredDate !== undefined ? body.masteredDate : existing.mastered_date,
    };

    statements.push(
      db.prepare(
        `UPDATE problems SET
          name = ?, diff = ?, status = ?, coll_id = ?, starred = ?, notes = ?,
          code = ?, language = ?, date = ?, interval = ?, next_rev = ?,
          rev_count = ?, no_rep = ?, last_reviewed = ?, solved_date = ?,
          mastered_date = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?`
      ).bind(
        updated.name,
        updated.diff,
        updated.status,
        updated.coll_id,
        updated.starred,
        updated.notes,
        updated.code,
        updated.language,
        updated.date,
        updated.interval,
        updated.next_rev,
        updated.rev_count,
        updated.no_rep,
        updated.last_reviewed,
        updated.solved_date,
        updated.mastered_date,
        problemId,
        userId
      )
    );

    // Tags replacement if provided
    if (Array.isArray(body.tags)) {
      statements.push(
        db.prepare(`DELETE FROM problem_tags WHERE problem_id = ?`).bind(problemId)
      );
      for (const tag of body.tags) {
        if (tag && typeof tag === 'string') {
          statements.push(
            db.prepare(
              `INSERT OR IGNORE INTO problem_tags (problem_id, tag) VALUES (?, ?)`
            ).bind(problemId, tag.trim())
          );
        }
      }
    }

    // Platforms replacement if provided
    if (Array.isArray(body.platforms)) {
      statements.push(
        db.prepare(`DELETE FROM problem_platforms WHERE problem_id = ?`).bind(problemId)
      );
      for (const pl of body.platforms) {
        if (pl && pl.platform && pl.url) {
          statements.push(
            db.prepare(
              `INSERT INTO problem_platforms (id, problem_id, platform, url) VALUES (?, ?, ?, ?)`
            ).bind(crypto.randomUUID(), problemId, pl.platform, pl.url)
          );
        }
      }
    }

    // Review history logging when revCount increases or reminder updated
    if (
      (body.revCount !== undefined && body.revCount > existing.rev_count) ||
      (body.lastReviewed && body.lastReviewed !== existing.last_reviewed)
    ) {
      statements.push(
        db.prepare(
          `INSERT INTO problem_reviews (id, problem_id, user_id, review_date, interval, status)
           VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(
          crypto.randomUUID(),
          problemId,
          userId,
          body.lastReviewed || today(),
          updated.interval,
          updated.status
        )
      );
    }

    await db.batch(statements);

    const savedProblem = await fetchSingleHydratedProblem(db, problemId, userId);
    return c.json(savedProblem);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// PUT /:id/trash - Soft delete or restore
problemsRoutes.put('/:id/trash', async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');
    const problemId = c.req.param('id');
    const { isDeleted, delDate } = await c.req.json();

    const problem = await db.prepare(
      `SELECT id FROM problems WHERE id = ? AND user_id = ?`
    ).bind(problemId, userId).first();

    if (!problem) {
      return c.json({ message: 'Problem not found or unauthorized' }, 404);
    }

    const isDel = isDeleted ? 1 : 0;
    const dateVal = isDel ? (delDate || today()) : null;

    await db.prepare(
      `UPDATE problems SET is_deleted = ?, del_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`
    ).bind(isDel, dateVal, problemId, userId).run();

    const updated = await fetchSingleHydratedProblem(db, problemId, userId);
    return c.json(updated);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// DELETE /trash/empty - Empty entire recycle bin
problemsRoutes.delete('/trash/empty', async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');

    await db.prepare(
      `DELETE FROM problems WHERE user_id = ? AND is_deleted = 1`
    ).bind(userId).run();

    return c.json({ message: 'Trash emptied permanently' });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// DELETE /:id - Permanently delete a problem
problemsRoutes.delete('/:id', async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');
    const problemId = c.req.param('id');

    const res = await db.prepare(
      `DELETE FROM problems WHERE id = ? AND user_id = ?`
    ).bind(problemId, userId).run();

    if (res.meta && res.meta.changes === 0) {
      return c.json({ message: 'Problem not found or unauthorized' }, 404);
    }

    return c.json({ message: 'Problem deleted permanently' });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

export default problemsRoutes;
