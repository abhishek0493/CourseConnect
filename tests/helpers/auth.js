/**
 * Shared cookie-based auth helper.
 *
 * Logs in via the API and returns the Set-Cookie header so subsequent
 * supertest requests can include it with `.set('Cookie', cookie)`.
 */

const request = require('supertest');
const app = require('../../app');

/**
 * Log in and return the JWT cookie string.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} cookie header value
 */
const loginAndGetCookie = async (email, password) => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password });

  if (res.status !== 201) {
    throw new Error(
      `Login failed for ${email}: ${res.status} ${JSON.stringify(res.body)}`
    );
  }

  const cookies = res.headers['set-cookie'];
  if (!cookies || cookies.length === 0) {
    throw new Error('No cookies returned from login');
  }

  // Return the first cookie (jwt=...)
  return cookies[0];
};

module.exports = { loginAndGetCookie };
