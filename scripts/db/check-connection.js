#!/usr/bin/env node
/**
 * CourseConnect — managed-DB connectivity check (Phase 2).
 *
 * Verifies the app user can reach the managed MySQL 8 instance over TLS with
 * the SAME env vars the app uses (DB_HOST/PORT/USER/PASSWORD/DATABASE, DB_SSL,
 * DB_CA), independently of Knex — so you can confirm Aiven creds before deploy.
 *
 * It reports: server version, the negotiated TLS cipher (proves encryption),
 * whether the CourseConnect database is reachable, and the effective privileges.
 *
 * Usage:
 *   # inline PEM in DB_CA (what Render uses), or point DB_CA_FILE / --ca at ca.pem
 *   DB_HOST=... DB_PORT=... DB_USER=cc_app DB_PASSWORD=... DB_DATABASE=CourseConnect \
 *   DB_SSL=true DB_CA_FILE=./ca.pem node scripts/db/check-connection.js
 *
 * Reads .env automatically (so `npm run db:check` works for local-against-Aiven).
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const mysql = require('mysql2/promise');

function resolveCa() {
  // --ca=<path> arg wins, then DB_CA_FILE (path), then DB_CA (inline PEM).
  const arg = process.argv.find((a) => a.startsWith('--ca='));
  const caPath = arg ? arg.slice('--ca='.length) : process.env.DB_CA_FILE;
  if (caPath) {
    const abs = path.resolve(caPath);
    if (!fs.existsSync(abs)) {
      console.error(`✗ CA file not found: ${abs}`);
      process.exit(2);
    }
    return fs.readFileSync(abs, 'utf8');
  }
  return process.env.DB_CA || undefined; // inline PEM contents
}

function buildSsl() {
  if (process.env.DB_SSL !== 'true') return undefined;
  const ca = resolveCa();
  // With a CA -> strict verification; without -> TLS on but no chain verify.
  return ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: true };
}

async function main() {
  const cfg = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'CourseConnect',
    ssl: buildSsl(),
    connectTimeout: 10000,
  };

  console.log('→ connecting:', {
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    database: cfg.database,
    ssl: cfg.ssl ? (cfg.ssl.ca ? 'on (CA verified)' : 'on (no CA verify)') : 'OFF',
  });

  let conn;
  try {
    conn = await mysql.createConnection(cfg);
  } catch (err) {
    console.error('\n✗ Connection FAILED:', err.code || '', '-', err.sqlMessage || err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('  → check DB_USER / DB_PASSWORD (note: "using password: NO" means the password env is empty).');
    }
    if (err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
      console.error('  → check DB_HOST / DB_PORT and the provider IP allow-list (Aiven uses a non-3306 port).');
    }
    if (err.code === 'HANDSHAKE_SSL_ERROR' || /SSL|certificate/i.test(err.message)) {
      console.error('  → TLS/CA issue: set DB_CA (or DB_CA_FILE) to the provider ca.pem, or DB_SSL=false to isolate.');
    }
    process.exit(1);
  }

  try {
    const [[ver]] = await conn.query('SELECT VERSION() AS version');
    const [[cipher]] = await conn.query("SHOW STATUS LIKE 'Ssl_cipher'");
    const [[db]] = await conn.query('SELECT DATABASE() AS db');
    const [grants] = await conn.query('SHOW GRANTS');

    console.log('\n✓ Connected.');
    console.log('  MySQL version :', ver.version);
    console.log('  TLS cipher    :', cipher && cipher.Value ? cipher.Value : '(none — NOT encrypted!)');
    console.log('  Current DB    :', db.db || '(none)');
    console.log('  Grants        :');
    for (const row of grants) console.log('   ', Object.values(row)[0]);

    if (!cipher || !cipher.Value) {
      console.error('\n⚠ Connection is NOT using TLS. For a managed DB this should be encrypted.');
      process.exitCode = 3;
    }
  } finally {
    await conn.end();
  }
}

main().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
