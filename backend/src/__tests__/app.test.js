import { describe, it, expect } from 'vitest';
import app from '../index.js';

describe('Edge Worker API Endpoints (src/index.js)', () => {
  it('GET / should return edge worker status metadata', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.service).toContain('DSA Tracker Edge Worker');
  });

  it('GET /health and GET /api/health should respond with ok timestamp', async () => {
    const res1 = await app.request('/health');
    expect(res1.status).toBe(200);
    const data1 = await res1.json();
    expect(data1.status).toBe('ok');
    expect(data1.timestamp).toBeDefined();

    const res2 = await app.request('/api/health');
    expect(res2.status).toBe(200);
    const data2 = await res2.json();
    expect(data2.status).toBe('ok');
  });

  it('GET /api/nonexistent-route should return 404 Route not found', async () => {
    const res = await app.request('/api/nonexistent-route');
    expect(res.status).toBe(404);

    const data = await res.json();
    expect(data.error).toBe('Route not found');
  });

  it('GET /api/problems without Authorization header should return 401 Unauthorized', async () => {
    const res = await app.request('/api/problems');
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.message).toContain('No authorization token');
  });

  it('GET /api/collections without Authorization header should return 401 Unauthorized', async () => {
    const res = await app.request('/api/collections');
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.message).toContain('No authorization token');
  });
});
