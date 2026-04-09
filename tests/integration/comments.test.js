/**
 * Integration tests — Comments API
 * Routes: POST /api/v1/comments/:thread_id
 *         POST /api/v1/comments/:thread_id/:comment_id  (reply)
 *         GET  /api/v1/comments/:id/up-vote
 *         GET  /api/v1/comments/:id/down-vote
 */

require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const { ctx, seed, teardown, destroyDb, db } = require('../helpers/setup');
const { loginAndGetCookie } = require('../helpers/auth');

let cookie;
let user2Cookie;
let createdCommentId;
let replyCommentId;

beforeAll(async () => {
  await seed();
  cookie = await loginAndGetCookie(ctx.userEmail, ctx.userPassword);
  user2Cookie = await loginAndGetCookie(ctx.user2Email, ctx.userPassword);
});

afterAll(async () => {
  // Clean up created comments in correct order
  const ids = [replyCommentId, createdCommentId].filter(Boolean);
  if (ids.length) {
    await db('user_comment_actions').whereIn('comment_id', ids).delete();
    await db('comments').whereIn('id', ids).delete();
  }
  await teardown();
  await destroyDb();
});

// ─── Create Comment ───────────────────────────────────────────────────────────

describe('POST /api/v1/comments/:thread_id', () => {
  it('creates a comment on the seeded thread', async () => {
    const res = await request(app)
      .post(`/api/v1/comments/${ctx.threadId}`)
      .set('Cookie', cookie)
      .send({ comment: 'Integration test comment via API' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();

    // Fetch the comment id
    const comment = await db('comments')
      .where({ thread_id: ctx.threadId, user_id: ctx.userId })
      .orderBy('id', 'desc')
      .first();
    createdCommentId = comment.id;
  });

  it('rejects empty comment body', async () => {
    const res = await request(app)
      .post(`/api/v1/comments/${ctx.threadId}`)
      .set('Cookie', cookie)
      .send({ comment: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app)
      .post(`/api/v1/comments/${ctx.threadId}`)
      .send({ comment: 'Unauthed' });
    expect(res.status).toBe(401);
  });
});

// ─── Create Reply ─────────────────────────────────────────────────────────────

describe('POST /api/v1/comments/:thread_id/:comment_id', () => {
  it('creates a reply to the seeded comment', async () => {
    const res = await request(app)
      .post(`/api/v1/comments/${ctx.threadId}/${ctx.commentId}`)
      .set('Cookie', user2Cookie)
      .send({ comment: 'Integration test reply' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const reply = await db('comments')
      .where({ thread_id: ctx.threadId, parent_comment_id: ctx.commentId })
      .orderBy('id', 'desc')
      .first();
    replyCommentId = reply?.id;
  });

  it('returns 401 without auth', async () => {
    const res = await request(app)
      .post(`/api/v1/comments/${ctx.threadId}/${ctx.commentId}`)
      .send({ comment: 'Unauthed reply' });
    expect(res.status).toBe(401);
  });
});

// ─── Up-vote Comment ──────────────────────────────────────────────────────────

describe('GET /api/v1/comments/:id/up-vote', () => {
  it('up-votes the seeded comment', async () => {
    const res = await request(app)
      .get(`/api/v1/comments/${ctx.commentId}/up-vote`)
      .set('Cookie', user2Cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toMatch(/up-voted/i);
  });

  it('cannot up-vote the same comment again', async () => {
    const res = await request(app)
      .get(`/api/v1/comments/${ctx.commentId}/up-vote`)
      .set('Cookie', user2Cookie);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get(`/api/v1/comments/${ctx.commentId}/up-vote`);
    expect(res.status).toBe(401);
  });
});

// ─── Down-vote Comment ────────────────────────────────────────────────────────

describe('GET /api/v1/comments/:id/down-vote', () => {
  it('down-votes (toggle from up-vote) the seeded comment', async () => {
    // user2 already up-voted above, so this should toggle
    const res = await request(app)
      .get(`/api/v1/comments/${ctx.commentId}/down-vote`)
      .set('Cookie', user2Cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toMatch(/down-voted/i);
    expect(res.body.data.toggle).toBe(true);
  });

  it('cannot down-vote the same comment again', async () => {
    const res = await request(app)
      .get(`/api/v1/comments/${ctx.commentId}/down-vote`)
      .set('Cookie', user2Cookie);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get(`/api/v1/comments/${ctx.commentId}/down-vote`);
    expect(res.status).toBe(401);
  });
});
