import { Hono } from 'hono';
import { verifyJwt, getJwtSecret } from '../utils/crypto.js';

const reportRoutes = new Hono();

// Helper to validate email format
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim().toLowerCase());
}

// Simple fast SHA-256 hash helper for anonymized IP rate-limiting
async function hashIP(ip) {
  if (!ip) return 'anonymous';
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + '_report_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).slice(0, 16).join('');
}

// POST /api/reports (Anyone can submit, email is compulsory)
reportRoutes.post('/', async (c) => {
  try {
    const db = c.env.DB;
    const jwtSecret = getJwtSecret(c.env);

    // Optional user authentication check
    let userId = null;
    const authHeader = c.req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = await verifyJwt(token, jwtSecret);
      if (payload && payload.id) {
        userId = payload.id;
      }
    }

    const { area, message, email, deviceInfo } = await c.req.json();

    if (!area || !message || !email) {
      return c.json({ message: 'Please select an area, enter your message, and provide your email.' }, 400);
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!isValidEmail(cleanEmail) || cleanEmail.length > 60) {
      return c.json({ message: 'A valid email address is required so we can notify you when the issue is resolved.' }, 400);
    }

    const cleanArea = String(area).trim();
    const cleanMessage = String(message).trim();
    if (cleanMessage.length < 5 || cleanMessage.length > 1500) {
      return c.json({ message: 'Report description must be between 5 and 1500 characters.' }, 400);
    }

    // Capture anonymized client IP
    const clientIP = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'local';
    const ipHash = await hashIP(clientIP);

    // Rate Limiting: Max 3 reports per 1 hour by email or IP
    const recentReports = await db.prepare(
      `SELECT COUNT(*) as count FROM bug_reports 
       WHERE (email = ? OR ip_hash = ?) 
       AND created_at > datetime('now', '-1 hour')`
    ).bind(cleanEmail, ipHash).first('count');

    if (Number(recentReports) >= 3) {
      return c.json({
        message: 'Too many reports submitted recently. Please try again after an hour.',
      }, 429);
    }

    const reportId = crypto.randomUUID();
    const cleanDevice = typeof deviceInfo === 'string' ? deviceInfo.slice(0, 150) : 'Web Client';

    await db.prepare(
      `INSERT INTO bug_reports (id, user_id, area, message, email, device_info, ip_hash) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(reportId, userId, cleanArea, cleanMessage, cleanEmail, cleanDevice, ipHash).run();

    return c.json({
      success: true,
      message: 'Bug report received successfully. Our team will investigate.',
      id: reportId,
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

export default reportRoutes;
