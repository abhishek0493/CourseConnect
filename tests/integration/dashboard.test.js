/**
 * Integration tests — Dashboard API
 * Routes: GET /api/v1/dashboard
 *         GET /api/v1/dashboard/get-recent-communities
 *         GET /api/v1/dashboard/get-saved-threads
 *         GET /api/v1/dashboard/search-threads?query=
 */

require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const { ctx, seed, teardown, destroyDb } = require('../helpers/setup');
const { loginAndGetCookie } = require('../helpers/auth');

let cookie;

beforeAll(async () => {
  await seed();
  cookie = await loginAndGetCookie(ctx.userEmail, ctx.userPassword);
});

afterAll(async () => {
  await teardown();
  await destroyDb();
});

// ─── Trending Threads ─────────────────────────────────────────────────────────

describe('GET /api/v1/dashboard', () => {
  it('returns trending threads', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('supports isCourse filter', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard?isCourse=1')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    res.body.data.forEach((t) => expect(t.type).toBe(1));
  });

  it('supports isCategory filter with valid id', async () => {
    const res = await request(app)
      .get(`/api/v1/dashboard?isCategory=${ctx.categoryId}`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('supports isAuthorPosted filter', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard?isAuthorPosted=1')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    res.body.data.forEach((t) => expect(t.user_id).toBe(ctx.userId));
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/v1/dashboard');
    expect(res.status).toBe(401);
  });
});

// ─── Recent Communities ───────────────────────────────────────────────────────

describe('GET /api/v1/dashboard/get-recent-communities', () => {
  it('returns up to 9 recent communities', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/get-recent-communities')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(9);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/v1/dashboard/get-recent-communities');
    expect(res.status).toBe(401);
  });
});

// ─── Saved Threads ────────────────────────────────────────────────────────────

describe('GET /api/v1/dashboard/get-saved-threads', () => {
  it('returns saved threads (may be empty for fresh user)', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/get-saved-threads')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/v1/dashboard/get-saved-threads');
    expect(res.status).toBe(401);
  });
});

// ─── Search Threads ───────────────────────────────────────────────────────────

describe('GET /api/v1/dashboard/search-threads', () => {
  it('returns results matching seeded community name', async () => {
    const query = ctx.communityName.slice(0, 8); // partial match
    const res = await request(app)
      .get(`/api/v1/dashboard/search-threads?query=${encodeURIComponent(query)}`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('returns results matching seeded thread title', async () => {
    const query = `Test Thread ${ctx.ts}`;
    const res = await request(app)
      .get(`/api/v1/dashboard/search-threads?query=${encodeURIComponent(query)}`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('returns empty array for a nonsense query', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/search-threads?query=xyzzy_no_match_12345')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/v1/dashboard/search-threads?query=test');
    expect(res.status).toBe(401);
  });
});
