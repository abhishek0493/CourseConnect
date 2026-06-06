/**
 * Integration tests — Users API
 * Routes: GET /api/v1/users
 *         GET /api/v1/users/get-stats
 *         GET /api/v1/users/community/view-all-requests
 *         GET /api/v1/users/community/request/:id/approve
 *         GET /api/v1/users/community/request/:id/reject
 */

require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const { ctx, seed, teardown, destroyDb, db } = require('../helpers/setup');
const { loginAndGetCookie } = require('../helpers/auth');

let cookie;
let user2Cookie;
let joinRequestId;

beforeAll(async () => {
  await seed();
  cookie = await loginAndGetCookie(ctx.userEmail, ctx.userPassword);
  user2Cookie = await loginAndGetCookie(ctx.user2Email, ctx.userPassword);

  // user2 sends a join request to the private community (access_type=2)
  await request(app)
    .get(`/api/v1/community/${ctx.privateCommunityId}/join`)
    .set('Cookie', user2Cookie);

  // Fetch the request record
  const req = await db('user_communities')
    .where({ user_id: ctx.user2Id, community_id: ctx.privateCommunityId })
    .first();
  joinRequestId = req?.id;
});

afterAll(async () => {
  if (joinRequestId) {
    await db('user_communities').where('id', joinRequestId).delete();
  }
  await teardown();
  await destroyDb();
});

// ─── Get All Users ────────────────────────────────────────────────────────────

describe('GET /api/v1/users', () => {
  it('returns list of all users', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(401);
  });
});

// ─── User Stats ───────────────────────────────────────────────────────────────

describe('GET /api/v1/users/get-stats', () => {
  it('returns stats for the logged-in user', async () => {
    const res = await request(app)
      .get('/api/v1/users/get-stats')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    const stats = res.body.data[0];
    expect(stats).toHaveProperty('total_communities_created');
    expect(stats).toHaveProperty('total_threads_created');
    expect(stats).toHaveProperty('total_comments');
    expect(stats).toHaveProperty('total_saved');
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/v1/users/get-stats');
    expect(res.status).toBe(401);
  });
});

// ─── Community Join Requests ──────────────────────────────────────────────────

describe('GET /api/v1/users/community/view-all-requests', () => {
  it('returns pending join requests for communities owned by logged-in user', async () => {
    const res = await request(app)
      .get('/api/v1/users/community/view-all-requests')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    // The private community should have user2's pending request
    const found = res.body.data.some((r) => r.id === joinRequestId);
    expect(found).toBe(true);
  });

  it('supports filtering by community name', async () => {
    const res = await request(app)
      .get(`/api/v1/users/community/view-all-requests?name=${ctx.privateCommunityName}`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.data.every((r) => r.name === ctx.privateCommunityName)).toBe(true);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/v1/users/community/view-all-requests');
    expect(res.status).toBe(401);
  });
});

// ─── Approve Join Request ─────────────────────────────────────────────────────

describe('GET /api/v1/users/community/request/:id/approve', () => {
  it('approves the pending join request', async () => {
    const res = await request(app)
      .get(`/api/v1/users/community/request/${joinRequestId}/approve`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toMatch(/approved/i);
  });

  it('cannot approve an already-approved request', async () => {
    const res = await request(app)
      .get(`/api/v1/users/community/request/${joinRequestId}/approve`)
      .set('Cookie', cookie);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for non-existent request id', async () => {
    const res = await request(app)
      .get('/api/v1/users/community/request/999999999/approve')
      .set('Cookie', cookie);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─── Reject Join Request (separate request seeded here) ───────────────────────

describe('GET /api/v1/users/community/request/:id/reject', () => {
  let rejectRequestId;

  beforeAll(async () => {
    // user2 leaves and re-sends a fresh request
    await db('user_communities')
      .where({ user_id: ctx.user2Id, community_id: ctx.privateCommunityId })
      .update({ status: -1 });

    await request(app)
      .get(`/api/v1/community/${ctx.privateCommunityId}/join`)
      .set('Cookie', user2Cookie);

    const reqRow = await db('user_communities')
      .where({ user_id: ctx.user2Id, community_id: ctx.privateCommunityId, status: 0 })
      .first();
    rejectRequestId = reqRow?.id;
  });

  afterAll(async () => {
    if (rejectRequestId) {
      await db('user_communities').where('id', rejectRequestId).delete();
    }
  });

  it('rejects the pending join request', async () => {
    if (!rejectRequestId) return;

    const res = await request(app)
      .get(`/api/v1/users/community/request/${rejectRequestId}/reject`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toMatch(/rejected/i);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/v1/users/community/request/1/reject');
    expect(res.status).toBe(401);
  });
});
