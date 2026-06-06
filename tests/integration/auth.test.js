/**
 * Integration tests — Auth API
 * Routes: POST /api/v1/auth/signUp
 *         POST /api/v1/auth/login
 *         GET  /api/v1/auth/logout
 *         GET  /api/v1/auth/check-login
 */

require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const { ctx, seed, teardown, destroyDb, db } = require('../helpers/setup');
const { loginAndGetCookie } = require('../helpers/auth');

let cookie;
// Track the signup user for cleanup
let signupUserId;

beforeAll(async () => {
  await seed();
  cookie = await loginAndGetCookie(ctx.userEmail, ctx.userPassword);
});

afterAll(async () => {
  if (signupUserId) {
    await db('users').where('id', signupUserId).delete();
  }
  await teardown();
  await destroyDb();
});

// ─── Sign Up ──────────────────────────────────────────────────────────────────

describe('POST /api/v1/auth/signUp', () => {
  const newEmail = `signup_${Date.now()}@example.com`;

  it('creates a new user and returns a JWT cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signUp')
      .send({
        name: 'New Test User',
        email: newEmail,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        type: 2,
        type_value: '',
        consent: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.data.user).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();

    // Store id for cleanup
    const user = await db('users').where('email', newEmail).first();
    signupUserId = user?.id;
  });

  it('rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signUp')
      .send({
        name: 'Duplicate User',
        email: ctx.userEmail, // already seeded
        password: 'Password123!',
        confirmPassword: 'Password123!',
        type: 2,
        type_value: '',
        consent: 1,
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('rejects mismatched confirmPassword', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signUp')
      .send({
        name: 'Bad User',
        email: `bad_${Date.now()}@example.com`,
        password: 'Password123!',
        confirmPassword: 'WrongPassword!',
        type: 2,
        consent: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signUp')
      .send({ email: `missing_${Date.now()}@example.com` });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─── Login ────────────────────────────────────────────────────────────────────

describe('POST /api/v1/auth/login', () => {
  it('logs in with valid credentials and returns a JWT cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: ctx.userEmail, password: ctx.userPassword });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('rejects unknown email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@test.invalid', password: 'Password123!' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: ctx.userEmail, password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects missing password field', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: ctx.userEmail });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─── Check Login ──────────────────────────────────────────────────────────────

describe('GET /api/v1/auth/check-login', () => {
  it('returns the logged-in user when cookie is valid', async () => {
    const res = await request(app)
      .get('/api/v1/auth/check-login')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.email).toBe(ctx.userEmail);
  });

  it('returns 401 with no cookie', async () => {
    const res = await request(app).get('/api/v1/auth/check-login');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

// ─── Logout ───────────────────────────────────────────────────────────────────

describe('GET /api/v1/auth/logout', () => {
  it('clears the JWT cookie', async () => {
    const res = await request(app)
      .get('/api/v1/auth/logout')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // Cookie should be overwritten with 'loggedout'
    const setCookie = res.headers['set-cookie']?.join('');
    expect(setCookie).toContain('loggedout');
  });
});
