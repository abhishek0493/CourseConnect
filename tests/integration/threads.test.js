/**
 * Integration tests — Threads API
 * Routes: POST /api/v1/threads
 *         GET  /api/v1/threads/:community/get-threads
 *         GET  /api/v1/threads/:id
 *         GET  /api/v1/threads/:id/up-vote-thread
 *         GET  /api/v1/threads/:id/down-vote-thread
 *         GET  /api/v1/threads/:id/save
 */

require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const { ctx, seed, teardown, destroyDb, db } = require('../helpers/setup');
const { loginAndGetCookie } = require('../helpers/auth');

let cookie;
let user2Cookie;
let createdThreadId;

beforeAll(async () => {
  await seed();
  cookie = await loginAndGetCookie(ctx.userEmail, ctx.userPassword);
  user2Cookie = await loginAndGetCookie(ctx.user2Email, ctx.userPassword);
});

afterAll(async () => {
  if (createdThreadId) {
    await db('user_thread_actions').where('thread_id', createdThreadId).delete();
    await db('comments').where('thread_id', createdThreadId).delete();
    await db('threads').where('id', createdThreadId).delete();
  }
  await teardown();
  await destroyDb();
});

// ─── Create Thread ────────────────────────────────────────────────────────────

describe('POST /api/v1/threads', () => {
  it('creates a general thread in the seeded community', async () => {
    const res = await request(app)
      .post('/api/v1/threads')
      .set('Cookie', cookie)
      .send({
        community: ctx.communityId,
        title: `Test Thread via API ${ctx.ts}`,
        type: 2, // General
        body: 'Created by integration test',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(ctx.communityName);

    // Store for later tests
    const threadRow = await db('threads')
      .where({ community_id: ctx.communityId, user_id: ctx.userId })
      .orderBy('id', 'desc')
      .first();
    createdThreadId = threadRow.id;
  });

  it('creates a course thread with all required fields', async () => {
    const res = await request(app)
      .post('/api/v1/threads')
      .set('Cookie', cookie)
      .send({
        community: ctx.communityId,
        title: `Course Thread ${ctx.ts}`,
        type: 1, // Course
        source: 'Udemy',
        pricing: 1,
        link: 'https://udemy.com/test',
        body: 'Course description',
        is_completed: false,
        rating: 4.5,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Cleanup extra thread
    if (res.body.data?.id) {
      await db('threads').where('id', res.body.data.id[0] ?? res.body.data.id).delete().catch(() => {});
    }
  });

  it('rejects thread with missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/threads')
      .set('Cookie', cookie)
      .send({ community: ctx.communityId }); // missing title, type

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app)
      .post('/api/v1/threads')
      .send({ community: ctx.communityId, title: 'Unauthed', type: 2 });
    expect(res.status).toBe(401);
  });
});

// ─── Get Community Threads ────────────────────────────────────────────────────

describe('GET /api/v1/threads/:community/get-threads', () => {
  it('returns threads for the seeded community', async () => {
    const res = await request(app)
      .get(`/api/v1/threads/${ctx.communityName}/get-threads`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.access).toBeDefined();
  });

  it('supports isCourse filter', async () => {
    const res = await request(app)
      .get(`/api/v1/threads/${ctx.communityName}/get-threads?isCourse=1`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    // All returned threads should be type 1 (course)
    res.body.data.forEach((t) => expect(t.type).toBe(1));
  });

  it('supports isPosted filter (only user\'s own threads)', async () => {
    const res = await request(app)
      .get(`/api/v1/threads/${ctx.communityName}/get-threads?isPosted=1`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    res.body.data.forEach((t) => expect(t.user_id).toBe(ctx.userId));
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get(`/api/v1/threads/${ctx.communityName}/get-threads`);
    expect(res.status).toBe(401);
  });
});

// ─── Get Thread With Nested Comments ─────────────────────────────────────────

describe('GET /api/v1/threads/:id', () => {
  it('returns thread details with nested comments', async () => {
    const res = await request(app)
      .get(`/api/v1/threads/${ctx.threadId}`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.thread).toBeDefined();
    expect(res.body.data.thread.id).toBe(ctx.threadId);
    expect(Array.isArray(res.body.data.comments)).toBe(true);
    expect(res.body.data.thread.is_access).toBeDefined();
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get(`/api/v1/threads/${ctx.threadId}`);
    expect(res.status).toBe(401);
  });
});

// ─── Up-vote Thread ───────────────────────────────────────────────────────────

describe('GET /api/v1/threads/:id/up-vote-thread', () => {
  it('up-votes the seeded thread', async () => {
    const res = await request(app)
      .get(`/api/v1/threads/${ctx.threadId}/up-vote-thread`)
      .set('Cookie', user2Cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toMatch(/up-voted/i);
  });

  it('cannot up-vote again (already up-voted)', async () => {
    const res = await request(app)
      .get(`/api/v1/threads/${ctx.threadId}/up-vote-thread`)
      .set('Cookie', user2Cookie);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get(`/api/v1/threads/${ctx.threadId}/up-vote-thread`);
    expect(res.status).toBe(401);
  });
});

// ─── Down-vote Thread ─────────────────────────────────────────────────────────

describe('GET /api/v1/threads/:id/down-vote-thread', () => {
  it('down-votes (toggle from up-vote) the seeded thread', async () => {
    // user2 previously up-voted, so this should toggle to down-vote
    const res = await request(app)
      .get(`/api/v1/threads/${ctx.threadId}/down-vote-thread`)
      .set('Cookie', user2Cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toMatch(/down-voted/i);
    expect(res.body.data.toggle).toBe(true);
  });

  it('cannot down-vote again (already down-voted)', async () => {
    const res = await request(app)
      .get(`/api/v1/threads/${ctx.threadId}/down-vote-thread`)
      .set('Cookie', user2Cookie);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

// ─── Save Thread ──────────────────────────────────────────────────────────────

describe('GET /api/v1/threads/:id/save', () => {
  it('saves the seeded thread', async () => {
    const res = await request(app)
      .get(`/api/v1/threads/${ctx.threadId}/save`)
      .set('Cookie', user2Cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toMatch(/saved/i);
  });

  it('toggles save off (unsave)', async () => {
    const res = await request(app)
      .get(`/api/v1/threads/${ctx.threadId}/save`)
      .set('Cookie', user2Cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.toggle).toBe(true);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get(`/api/v1/threads/${ctx.threadId}/save`);
    expect(res.status).toBe(401);
  });
});
