// Knex configuration.
//
// All credentials come from environment variables — never hardcode secrets here.
// For local development, copy .env.example to .env and fill in your values.
//
// The `knex` CLI (migrations) does not load .env on its own the way the app does,
// so load it here too. dotenv never overrides vars already in the environment, so
// inline overrides (e.g. `DB_HOST=… npx knex migrate:latest`) still win.
const fs = require('fs');
require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

// Managed MySQL providers (Aiven, RDS, etc.) require TLS. Enable with DB_SSL=true.
// Provide the CA for strict verification as either DB_CA_FILE (path to ca.pem) or
// DB_CA (inline PEM contents — used by Render, where you paste the cert).
const caCert = process.env.DB_CA_FILE
  ? fs.readFileSync(process.env.DB_CA_FILE, 'utf8')
  : process.env.DB_CA;

const ssl =
  process.env.DB_SSL === 'true'
    ? caCert
      ? { ca: caCert, rejectUnauthorized: true }
      : { rejectUnauthorized: true }
    : undefined;

// SSL lives on the base connection so EVERY environment (development/test/
// production) honors DB_SSL — running migrations against a TLS-only managed DB
// must not silently fall back to an unencrypted connection.
const baseConnection = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'CourseConnect',
  ...(ssl ? { ssl } : {}),
};

module.exports = {
  development: {
    client: 'mysql2',
    connection: baseConnection,
    pool: { min: 0, max: 7 },
  },

  test: {
    client: 'mysql2',
    connection: {
      ...baseConnection,
      database: process.env.DB_TEST_DATABASE || baseConnection.database,
    },
    pool: { min: 0, max: 5 },
  },

  production: {
    client: 'mysql2',
    connection: baseConnection,
    pool: {
      min: Number(process.env.DB_POOL_MIN || 2),
      max: Number(process.env.DB_POOL_MAX || 10),
    },
    migrations: { tableName: 'knex_migrations' },
  },
};
