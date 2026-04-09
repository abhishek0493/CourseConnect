/**
 * Integration tests — Categories & Access Types (Misc API)
 * Routes: GET /api/v1/categories
 *         GET /api/v1/categories/access-types
 *         GET /api/v1/community/categories   (via communites router)
 *         GET /api/v1/users/categories       (user types)
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

// ─── Categories ───────────────────────────────────────────────────────────────

describe('GET /api/v1/categories', () => {
  it('returns list of categories (public route)', async () => {
    const res = await request(app).get('/api/v1/categories');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('GET /api/v1/categories/access-types', () => {
  it('returns access types object', async () => {
    const res = await request(app).get('/api/v1/categories/access-types');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // accessTypes is whatever is defined in constants — just ensure non-null
    expect(res.body.data).toBeDefined();
  });
});

// ─── Community categories (mounted via communities router) ────────────────────

describe('GET /api/v1/community/categories', () => {
  it('returns categories list', async () => {
    const res = await request(app).get('/api/v1/community/categories');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

// ─── User Types ───────────────────────────────────────────────────────────────

describe('GET /api/v1/users/categories', () => {
  it('returns user type definitions', async () => {
    const res = await request(app).get('/api/v1/users/categories');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });
});
