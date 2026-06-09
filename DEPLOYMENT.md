# CourseConnect — Production Deployment Checklist

**Architecture:** Same-origin **monolith on Render** — one Express service serves both the built Vite SPA and the `/api/v1/*` API · **Managed MySQL 8**

```
  Browser ──HTTPS──> courseconnect.example.com   (Render Web Service)
                     ┌──────────────────────────────────────┐
                     │ Express:                              │
                     │   • /api/v1/*  → controllers          │
                     │   • /*         → client/dist (SPA)     │
                     └──────────────────┬───────────────────┘
                                        │ TLS (private)
                                        ▼
                                  Managed MySQL 8
                                  (Aiven / Railway / RDS, daily backups)
```

---

## ✅ Progress — Phase 1 (code) implemented & verified locally
The pre-deploy **code** changes are done on this branch and verified by running the
server in `NODE_ENV=production` (SPA served from `client/dist`, CSP allows fonts,
`/healthz`, SPA fallback, API 404, prod build all green). Files touched:
`package.json` (build script, Node 20, `compression`, **`mysql2`**), `knexfile.js`
(env-driven + SSL + pool + `mysql2`), `app.js` (trust proxy, CSP, CORS, rate limits,
compression, static `client/dist`, `/healthz`, SPA fallback), `controllers/authController.js`
(prod cookie attrs), `.nvmrc`, `render.yaml`, `.env.example`, `client/.env.example`,
`client/public/service-worker.js` (self-unregister); removed stale CRA `public/`.

**What remains = infrastructure & account actions** (Phases 2–11) — provisioning, secrets,
DNS, and the few user-only code follow-ups still marked `[ ]` in Phase 1.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done.

---

## Phase 0 — Accounts & prerequisites
- [ ] Render account + payment method (for paid DB/instance if needed)
- [ ] Managed MySQL 8 provider chosen (Aiven / Railway / AWS RDS)
- [ ] Custom domain (recommended) + DNS provider access
- [ ] GitHub repo admin access (for CI secrets + deploy hooks)
- [ ] Local tooling: Node 20 LTS, `git`, Render CLI (optional)

---

## Phase 1 — Pre-deploy code changes

### Done in code (verified locally)
- [x] Make `knexfile.js` fully **env-driven** (removed hardcoded dev password) + SSL via `DB_SSL` + connection pool
- [x] Switch DB driver to **`mysql2`** (legacy `mysql` v2 fails MySQL 8 `caching_sha2_password` — confirmed by local test)
- [x] Root **build script**: `npm run build` → builds `client/dist`
- [x] Express serves the Vite SPA from `client/dist` (static + SPA fallback), API kept before fallback, `/api/*` returns JSON 404
- [x] **Purged stale CRA artifacts** (removed old root `public/` build output entirely)
- [x] **Self-unregistering service worker** shipped at `client/public/service-worker.js`
- [x] **Helmet CSP** allowing the UI's fonts/styles/assets (verified header allows `fonts.googleapis.com` / `fonts.gstatic.com`)
- [x] `app.set('trust proxy', 1)`
- [x] Prod auth + logout cookies: `secure` + `sameSite: 'lax'`
- [x] Env-driven CORS (`CLIENT_URL`), hardcoded Heroku origin removed
- [x] Rate limiting enabled — global cap + stricter `/api/v1/auth` cap
- [x] `GET /healthz` (DB ping) for the Render health probe
- [x] `compression` middleware + immutable caching for hashed assets / no-cache `index.html`
- [x] Node pinned to `20.x` + `.nvmrc`
- [x] `render.yaml` blueprint + `.env.example` + `client/.env.example`
- [x] Origin-relative API base wired (`VITE_BASE_URL=""` → `/api/v1`)

### Remaining (user / external actions)
- [ ] **Rotate the leaked dev DB password** in the actual MySQL server (it was committed as `abhishek@93`); treat as compromised
- [ ] **Fix local `.env`**: it currently points `DB_*` at the remote **ClearDB/Heroku** DB with `NODE_ENV=development`. Now that dev reads `DB_*` from env, point these at your **local** MySQL (see `.env.example`) to avoid local dev hitting the live DB
- [ ] Remove obsolete `REACT_APP_*` keys from the backend `.env`
- [ ] (Optional, recommended) Replace deprecated **`xss-clean`** with a maintained sanitizer or rely on existing `joi` validation
- [ ] (Optional) Self-host Inter / Plus Jakarta Sans and tighten CSP further (drop the Google Fonts `@import`)
- [ ] (Optional) Scrub the leaked secret from git history (`git filter-repo` / BFG)

---

## Phase 2 — Provision the database (managed MySQL 8 — **Aiven**)

### Prepared in repo (use these to execute the steps below)
- [x] Least-privilege user SQL → `scripts/db/create-app-user.sql` (creates `CourseConnect` + `cc_app`, db-scoped grants, **no** SUPER/FILE/CREATE USER)
- [x] TLS connectivity check → `npm run db:check` (`scripts/db/check-connection.js`): reports server version, **negotiated TLS cipher**, current DB, and effective grants; flags any unencrypted connection
- [x] `render.yaml` updated for Aiven: `DB_PORT` is now a per-service secret (Aiven uses a **non-3306** port) and `DB_CA` is wired in for strict TLS

### Console / account actions (Aiven — user)
- [ ] Create a managed MySQL 8 service in a region close to Render's `oregon` (e.g. `google-us-west` / `aws-us-west-2`)
- [ ] In the Aiven console, copy the **service URI** parts → `DB_HOST`, `DB_PORT` (custom!), admin user `avnadmin` + password; download **`ca.pem`**
- [ ] Create app DB + least-privilege user: `mysql --host <H> --port <P> --user avnadmin --password --ssl-mode=REQUIRED --ssl-ca=ca.pem < scripts/db/create-app-user.sql` (set a strong `cc_app` password first)
- [ ] Verify before deploy: `DB_HOST=… DB_PORT=… DB_USER=cc_app DB_PASSWORD=… DB_DATABASE=CourseConnect DB_SSL=true DB_CA_FILE=./ca.pem npm run db:check` → expect a TLS cipher + the `cc_app` grants
- [ ] TLS-only is on by default on Aiven; keep `ca.pem` → set as `DB_CA` in Render (Phase 5)
- [ ] Restrict network access: add Render's egress IPs to the Aiven **Allowed IP** list
- [ ] Record `DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_DATABASE` for the Render secret store (Phase 5)
- [ ] Enable automated daily backups + retention (Aiven backups are on by default; confirm retention + note PITR window)
- [ ] **Run a test restore**: fork the service (Aiven "fork"/PITR) into a scratch service and `npm run db:check` against it before go-live

---

## Phase 3 — Deploy on Render (single Web Service)
- [ ] Create the **Web Service** from the repo (or import `render.yaml` as a Blueprint)
- [ ] **Build Command:** `npm ci && npm run build`
- [ ] **Start Command:** `npm start`
- [ ] **Pre-Deploy Command:** `npx knex migrate:latest` (needs `NODE_ENV=production`)
- [ ] Region = DB region; pick a plan (`free` spins down; `starter`+ stays warm)
- [ ] **Health check path:** `/healthz`
- [ ] Set env vars (Phase 5)
- [ ] First deploy → logs show "Database connection successful" + healthy
- [ ] `GET /healthz` → `200`; `GET /api/v1/categories/access-types` returns data
- [ ] Root URL serves the **new SPA**, fonts load, dark/light toggle works
- [ ] Deep-link refresh works (`/dashboard/...` → SPA fallback, not 404)

---

## Phase 4 — Domain & TLS
- [ ] Point your domain (CNAME) → Render; add it as a custom domain
- [ ] TLS auto-provisions; force HTTPS + HSTS (Helmet already sends HSTS)
- [ ] Set `CLIENT_URL` to the final HTTPS origin
- [ ] Confirm end-to-end load over HTTPS on the final domain

---

## Phase 5 — Configuration & secrets (env var matrix)
> Set in Render's secret manager. Never in git. Rotate anything that touched the repo.

### Render — runtime
- [ ] `NODE_ENV=production`
- [ ] `PORT` (provided by Render)
- [ ] `JWT_SECRET_KEY` (new ≥256-bit random; rotate old)
- [ ] `JWT_COOKIE_EXPIRES_IN` (days)
- [ ] `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_DATABASE`
- [ ] `DB_SSL=true`  (+ `DB_CA` if strict verification)
- [ ] `CLIENT_URL=https://courseconnect.example.com`

### Render — build-time (Vite, inlined at build)
- [ ] `VITE_ENV=production`
- [ ] `VITE_BASE_URL=` (empty → origin-relative `/api/v1`)

> Changing `VITE_*` requires a **re-deploy**, not just an env edit.

---

## Phase 6 — CI/CD
- [ ] Branch model: feature → `master`; deploy from `master`
- [ ] GitHub Actions on PR + main:
  - [ ] `npm ci` → `npm test` (Jest/Supertest) against a MySQL **service container** with migrations applied
  - [ ] `npm run build` (catches client build breakage incl. JSX-in-`.js` Vite config)
  - [ ] Lint/format gate · `npm audit --production`
- [ ] Render auto-deploys `master` (pre-deploy migration runs first)
- [ ] Migrations kept **backward-compatible** (expand → migrate → contract)
- [ ] Stand up a **staging** Render service + scratch DB; promote to prod manually or on tag

---

## Phase 7 — Security hardening
- [ ] DB password + JWT secret rotated; scrub from history if feasible
- [ ] Least-privilege DB user; TLS-only DB connections verified
- [x] Cookies: `httpOnly` + `secure` + `sameSite: 'lax'`
- [x] Helmet enabled with explicit CSP; HSTS on
- [x] Rate limiter enabled globally + stricter on auth routes
- [x] CORS locked to `CLIENT_URL` (no `*` with credentials)
- [ ] Secrets only in Render's store; none baked into images or the client bundle
- [ ] Token expiry sane; consider refresh/rotation for long sessions

---

## Phase 8 — Observability & operations
- [x] `/healthz` endpoint (wire it to Render health checks + an uptime monitor)
- [x] Prod request logging (`morgan('combined')` → stdout / Render log drain)
- [ ] Error tracking (Sentry) on backend **and** frontend, with release tagging
- [ ] Alerts: 5xx rate, p95 latency, DB connection failures, instance restarts
- [ ] DB metrics: connections, slow queries, disk
- [x] Knex `pool` configured for production (tune `DB_POOL_MIN/MAX` to instance vs DB cap)
- [x] Compression + static asset caching

---

## Phase 9 — Staging verification / smoke tests
- [ ] Signup → login → **cookie set over HTTPS** (Application tab)
- [ ] `check-login` returns the user after refresh (session persists)
- [ ] Create community → thread (course + discussion) → vote → save
- [ ] Comment + nested reply; vote on comments
- [ ] Join flow + join-requests approve/reject
- [ ] Search, saved threads, filters
- [ ] Logout clears the cookie (Safari **and** Chrome)
- [ ] Dark/light theme persists; mobile drawer + responsive layouts
- [ ] Deep-link refresh works; 404/no-access states render
- [ ] No stale-service-worker caching of old assets (hard-reload + check)

---

## Phase 10 — Production cutover
- [ ] All Phase 1 follow-ups + infra complete
- [ ] Prod env vars set on Render; secrets verified, none in git
- [ ] CI green; migrations applied cleanly via pre-deploy
- [ ] Custom domain live with forced HTTPS + HSTS
- [ ] Health checks, logging, error tracking, uptime alerts live
- [ ] Rollback rehearsed (Render previous-deploy redeploy; DB N-1 compatible)
- [ ] Backups verified by a test restore
- [ ] Announce go-live; monitor dashboards for the first hours

---

## Phase 11 — Post-launch
- [ ] Watch error rates, latency, DB load for 48h
- [ ] Tune Knex pool + Render instance size / autoscaling from real traffic
- [ ] Schedule dependency + `npm audit` review cadence
- [ ] Document the deploy + rollback runbook (RTO/RPO targets)
- [ ] Backlog: CDN in front of Render, refresh tokens, seed/demo data strategy

---

### Top risks to keep front-of-mind
1. **MySQL 8 auth + driver** — fixed by moving to `mysql2`; still confirm the managed DB user connects (Phase 2).
2. **Local `.env` points at ClearDB** — repoint to local MySQL so dev doesn't mutate the live DB (Phase 1 remaining).
3. **Build-time frontend env** — `VITE_BASE_URL` is inlined at build; origin-relative (`""`) avoids host coupling but changes still need a re-deploy.
4. **Migrations in pre-deploy** with `NODE_ENV=production` — verify Knex selects `production` and SSL connects.
5. **Leaked dev DB password** in git history — rotate + (optionally) purge.
