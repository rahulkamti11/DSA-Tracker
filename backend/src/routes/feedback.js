import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';

const feedbackRoutes = new Hono();

// Helper to validate email format
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim().toLowerCase());
}

// POST /api/feedback (Registered users only)
feedbackRoutes.post('/', authMiddleware, async (c) => {
  try {
    const db = c.env.DB;
    const userId = c.get('userId');

    // 1. Check if user is guest
    const user = await db.prepare(`SELECT username FROM users WHERE id = ?`).bind(userId).first();
    if (!user || user.username === 'guest') {
      return c.json({ message: 'Only registered users can submit feedback. Please log in or register.' }, 403);
    }

    const { reason, rating, message, email } = await c.req.json();

    if (!reason || !message || !email) {
      return c.json({ message: 'Please select a reason, enter your message and email.' }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail) || cleanEmail.length > 60) {
      return c.json({ message: 'Please provide a valid email address.' }, 400);
    }

    const cleanReason = String(reason).trim();
    const cleanMessage = String(message).trim();
    if (cleanMessage.length < 5 || cleanMessage.length > 1000) {
      return c.json({ message: 'Feedback message must be between 5 and 1000 characters.' }, 400);
    }

    const numRating = Number(rating);
    const validRating = Number.isInteger(numRating) && numRating >= 1 && numRating <= 5 ? numRating : null;

    // 2. Rate Limiting: Max 3 feedbacks per 24 hours per user
    const recentCountResult = await db.prepare(
      `SELECT COUNT(*) as count FROM feedback 
       WHERE user_id = ? AND created_at > datetime('now', '-1 day')`
    ).bind(userId).first('count');

    if (Number(recentCountResult) >= 3) {
      return c.json({
        message: 'You have reached your feedback limit for today (max 3/day). Thank you for sharing your thoughts!',
      }, 429);
    }

    // 3. Insert feedback
    const feedbackId = crypto.randomUUID();
    await db.prepare(
      `INSERT INTO feedback (id, user_id, reason, rating, message, email) 
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(feedbackId, userId, cleanReason, validRating, cleanMessage, cleanEmail).run();

    return c.json({
      success: true,
      message: 'Thank you! Your feedback has been received.',
      id: feedbackId,
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

export default feedbackRoutes;
