// Knex configuration.
//
// All credentials come from environment variables — never hardcode secrets here.
// For local development, copy .env.example to .env and fill in your values.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

// Managed MySQL providers (Aiven, RDS, etc.) require TLS. Enable with DB_SSL=true.
// Optionally provide a CA certificate via DB_CA (PEM contents) for strict verification.
const ssl =
  process.env.DB_SSL === 'true'
    ? process.env.DB_CA
      ? { ca: process.env.DB_CA, rejectUnauthorized: true }
      : { rejectUnauthorized: true }
    : undefined;

const baseConnection = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'CourseConnect',
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
    connection: {
      ...baseConnection,
      ...(ssl ? { ssl } : {}),
    },
    pool: {
      min: Number(process.env.DB_POOL_MIN || 2),
      max: Number(process.env.DB_POOL_MAX || 10),
    },
    migrations: { tableName: 'knex_migrations' },
  },
};
