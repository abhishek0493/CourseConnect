-- CourseConnect — least-privilege application DB user (Phase 2)
--
-- Run this ONCE against the managed MySQL 8 instance as the admin user
-- (on Aiven that's `avnadmin`). It creates the app database and a user that
-- has exactly the privileges the app + Knex migrations need — and nothing
-- global (no SUPER / FILE / CREATE USER / process-wide grants).
--
-- Usage (Aiven gives you host, port, and the avnadmin password in the console):
--   mysql --host <DB_HOST> --port <DB_PORT> --user avnadmin --password \
--         --ssl-mode=REQUIRED --ssl-ca=ca.pem < scripts/db/create-app-user.sql
--
-- BEFORE RUNNING: replace REPLACE_WITH_STRONG_PASSWORD below with a freshly
-- generated secret (e.g. `openssl rand -base64 24`). This is the value you will
-- store as DB_PASSWORD in Render — never commit it.

-- 1) App database (Aiven may have pre-created an empty `defaultdb`; we use our own).
CREATE DATABASE IF NOT EXISTS `CourseConnect`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2) App user. '%' host = connect from anywhere (Render egress); pair with the
--    provider's network/IP allow-list (Phase 2) to actually restrict origin.
--    MySQL 8 defaults to caching_sha2_password, which mysql2 supports over TLS.
CREATE USER IF NOT EXISTS 'cc_app'@'%'
  IDENTIFIED BY 'REPLACE_WITH_STRONG_PASSWORD';

-- 3) Least-privilege grants, scoped to the CourseConnect database only.
--    DML (runtime) + DDL (Knex migrations: create/alter/drop tables, indexes,
--    FKs) + the temp-table/lock privileges Knex and MySQL housekeeping use.
GRANT SELECT, INSERT, UPDATE, DELETE,
      CREATE, ALTER, DROP, INDEX, REFERENCES,
      CREATE TEMPORARY TABLES, LOCK TABLES
  ON `CourseConnect`.*
  TO 'cc_app'@'%';

FLUSH PRIVILEGES;

-- Verify what the app user ended up with:
--   SHOW GRANTS FOR 'cc_app'@'%';
