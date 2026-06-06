/**
 * Integration tests — Community API
 * Routes: GET  /api/v1/community
 *         POST /api/v1/community
 *         POST /api/v1/community/check-availability
 *         GET  /api/v1/community/:name
 *         GET  /api/v1/community/:name/check-access
 *         GET  /api/v1/community/:id/join
 *         GET  /api/v1/community/:id/leave
 */

require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const { ctx, seed, teardown, destroyDb, db } = require('../helpers/setup');
const { loginAndGetCookie } = require('../helpers/auth');

let cookie;
let user2Cookie;
// Track communities created by tests so we clean them up
const createdCommunityIds = [];
const createdUserCommunityIds = [];

beforeAll(async () => {
  await seed();
  cookie = await loginAndGetCookie(ctx.userEmail, ctx.userPassword);
  user2Cookie = await loginAndGetCookie(ctx.user2Email, ctx.userPassword);
});

afterAll(async () => {
  // Clean up any communities created during tests
  if (createdCommunityIds.length) {
    await db('user_communities').whereIn('community_id', createdCommunityIds).delete();
    await db('communities').whereIn('id', createdCommunityIds).delete();
  }
  await teardown();
  await destroyDb();
});

// ─── List User Communities ─────────────────────────────────────────────────────

describe('GET /api/v1/community', () => {
  it('returns the list of communities for the logged-in user', async () => {
    const res = await request(app)
      .get('/api/v1/community')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    // Seeded user is author of at least one community
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/v1/community');
    expect(res.status).toBe(401);
  });
});

// ─── Check Name Availability ──────────────────────────────────────────────────

describe('POST /api/v1/community/check-availability', () => {
  it('reports existing community name as taken', async () => {
    const res = await request(app)
      .post('/api/v1/community/check-availability')
      .set('Cookie', cookie)
      .send({ name: ctx.communityName });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.exists).toBe(true);
  });

  it('reports unused name as available', async () => {
    const res = await request(app)
      .post('/api/v1/community/check-availability')
      .set('Cookie', cookie)
      .send({ name: `totally-free-name-${Date.now()}` });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.exists).toBe(false);
  });
});

// ─── Create Community ─────────────────────────────────────────────────────────

describe('POST /api/v1/community', () => {
  it('creates a new community', async () => {
    const newName = `comm${Date.now()}`.slice(0, 20); // max 20 chars in schema
    const res = await request(app)
      .post('/api/v1/community')
      .set('Cookie', cookie)
      .send({
        name: newName,
        title: 'Auto-created test community',
        accessType: 1,
        description: 'Integration test creation',
        category: ctx.categoryId,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(newName);
    createdCommunityIds.push(Number(res.body.data.id));
  });

  it('rejects invalid payload (short name)', async () => {
    const res = await request(app)
      .post('/api/v1/community')
      .set('Cookie', cookie)
      .send({
        name: 'ab', // min 3 chars
        title: 'Bad',
        accessType: 1,
        description: 'Bad',
        category: ctx.categoryId,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app)
      .post('/api/v1/community')
      .send({ name: 'unauthed', title: 'x', accessType: 1, description: 'x', category: 1 });
    expect(res.status).toBe(401);
  });
});

// ─── Get Community By Name ────────────────────────────────────────────────────

describe('GET /api/v1/community/:name', () => {
  it('returns community details for the seeded community', async () => {
    const res = await request(app)
      .get(`/api/v1/community/${ctx.communityName}`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(ctx.communityName);
    expect(res.body.data.is_author).toBe(true);
  });

  it('returns 400 for non-existent community', async () => {
    const res = await request(app)
      .get('/api/v1/community/does-not-exist-xyz')
      .set('Cookie', cookie);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─── Check Access ─────────────────────────────────────────────────────────────

describe('GET /api/v1/community/:name/check-access', () => {
  it('returns access=true for author of public community', async () => {
    const res = await request(app)
      .get(`/api/v1/community/${ctx.communityName}/check-access`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.access).toBe(true);
  });
});

// ─── Join Community ───────────────────────────────────────────────────────────

describe('GET /api/v1/community/:id/join', () => {
  it('user2 can join the public community', async () => {
    const res = await request(app)
      .get(`/api/v1/community/${ctx.communityId}/join`)
      .set('Cookie', user2Cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toMatch(/Joined/i);
  });

  it('user2 cannot join again (already a member)', async () => {
    const res = await request(app)
      .get(`/api/v1/community/${ctx.communityId}/join`)
      .set('Cookie', user2Cookie);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('author cannot join their own community', async () => {
    const res = await request(app)
      .get(`/api/v1/community/${ctx.communityId}/join`)
      .set('Cookie', cookie);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

// ─── Leave Community ──────────────────────────────────────────────────────────

describe('GET /api/v1/community/:id/leave', () => {
  it('user2 can leave the community they just joined', async () => {
    const res = await request(app)
      .get(`/api/v1/community/${ctx.communityId}/leave`)
      .set('Cookie', user2Cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('user2 cannot leave again (already left)', async () => {
    const res = await request(app)
      .get(`/api/v1/community/${ctx.communityId}/leave`)
      .set('Cookie', user2Cookie);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
