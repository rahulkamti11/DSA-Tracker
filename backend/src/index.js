import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoutes from './routes/auth.js';
import problemsRoutes from './routes/problems.js';
import collectionsRoutes from './routes/collections.js';

const app = new Hono();

// Global CORS Middleware
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 86400,
  })
);

// Health check endpoints for frontend and status probes
app.get('/', (c) =>
  c.json({
    status: 'ok',
    service: 'DSA Tracker Edge Worker',
    runtime: 'Cloudflare Workers + D1 (SQLite)',
  })
);

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Mount API feature routes
app.route('/api/auth', authRoutes);
app.route('/api/problems', problemsRoutes);
app.route('/api/collections', collectionsRoutes);

// 404 fallback for unmatched API requests
app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404);
});

// Global error handler
app.onError((err, c) => {
  console.error('Unhandled Worker Exception:', err);
  return c.json({ error: err.message || 'Internal Server Error' }, 500);
});

export default app;
