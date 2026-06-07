# CourseConnect — Production Deployment Checklist

**Architecture:** Split — **Frontend on Vercel** · **Backend API on Render** · **Managed MySQL 8**

```
  Browser ──HTTPS──> app.example.com   (Vercel: client/dist static SPA + CDN)
                          │  XHR (credentials: include)
                          ▼
                     api.example.com    (Render: Express API only, /api/v1/*)
                          │  TLS
                          ▼
                     Managed MySQL 8    (Aiven / Railway / RDS, daily backups)
```

> **⚠️ Read first — cookie auth + split origins.** Auth uses a JWT in an `httpOnly`
> cookie. If the frontend and backend live on *different root domains*
> (`*.vercel.app` vs `*.onrender.com`), that cookie is a **third-party cookie** and
> is blocked by Safari (ITP) and modern Chrome → login appears to succeed but every
> subsequent request is unauthenticated. **Mitigation (required): put both behind one
> registrable domain as subdomains** (`app.example.com` + `api.example.com`). Then the
> cookie is *first-party / same-site* and works everywhere. This is reflected as a
> required step in Phase 5.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done. Update as you go.

---

## Phase 0 — Accounts & prerequisites
- [ ] Vercel account + project access
- [ ] Render account + payment method (for paid DB/instance if needed)
- [ ] Managed MySQL provider chosen (Aiven / Railway / PlanetScale-compatible / AWS RDS)
- [ ] A registrable **custom domain** purchased (required for cookie auth — see warning above)
- [ ] DNS provider access (Cloudflare/registrar) for subdomains + TLS validation
- [ ] GitHub repo admin access (for CI secrets + deploy hooks)
- [ ] Local tooling: Node 20 LTS, `git`, Render CLI (optional), Vercel CLI (optional)

---

## Phase 1 — Pre-deploy code changes (blockers)
> All scoped, small. Land these on a branch and merge before first deploy.

### Secrets & config hygiene
- [ ] Rotate the **committed dev DB password** in `knexfile.js` (`password: 'abhishek@93'`); treat it as compromised
- [ ] Make `knexfile.js` `development` read from env too (no plaintext creds anywhere)
- [ ] Add `ssl` to `knexfile.js` `production` connection (managed MySQL requires TLS), e.g. `connection: { …, ssl: { rejectUnauthorized: true } }` gated by `DB_SSL`
- [ ] Remove obsolete `REACT_APP_*` keys from backend `.env` (CRA leftovers)
- [ ] Confirm `.env` is gitignored (it is) and no secrets are committed

### Backend (Render) — Express
- [ ] `app.set('trust proxy', 1)` in `app.js` (needed behind Render's proxy for `req.secure`, secure cookies, real client IP for rate-limit)
- [ ] Env-drive CORS: replace hardcoded Heroku origin in `app.js` `corsOptions.origin` with `process.env.CLIENT_URL` (the Vercel/app domain). Keep `credentials: true`
- [ ] Auth cookie for prod in `controllers/authController.js` `createSendToken`:
      `secure: true`, `sameSite: 'none'` (cross-site) **or** `sameSite: 'lax'` + `domain: process.env.COOKIE_DOMAIN` (e.g. `.example.com`) when using shared subdomains (preferred)
- [ ] Apply the **same** `secure`/`sameSite`/`domain` attributes to the **logout** cookie so it actually clears in prod
- [ ] Enable the rate limiter: uncomment `app.use('/api', limiter)` in `app.js`; add a stricter limiter on `/api/v1/auth/*`
- [ ] Add a health check route `GET /healthz` → `200` + `db.raw('SELECT 1')`
- [ ] Decide on the SPA fallback `app.get('*')`: on an API-only host it's unused — replace with a JSON `404` (or keep harmlessly)
- [ ] Pin Node: `"engines": { "node": "20.x" }` in root `package.json` + add `.nvmrc` (`20`)
- [ ] Replace/relax deprecated **`xss-clean`** (unmaintained) — rely on existing `joi` validation + output encoding, or swap for a maintained sanitizer
- [ ] Add `release`/pre-deploy migration step (see Phase 3) — ensure `knex migrate:latest` runs with `NODE_ENV=production`

### Frontend (Vercel) — Vite client
- [ ] Point the client API base at the prod API: confirm `client/src/App.js` picks `VITE_BASE_URL` when `VITE_ENV === 'production'`
- [ ] Set a correct `VITE_BASE_URL` (current `client/.env` has the wrong `https://localhost:3000`) — should be `https://api.example.com`
- [ ] Add `client/vercel.json`: SPA rewrite (`/(.*) → /index.html`) + long-cache headers for hashed assets, no-cache for `index.html`
- [ ] (Reliability) Self-host Inter / Plus Jakarta Sans instead of the Google Fonts `@import` in `client/src/index.css`, or add a CSP `font-src`/`style-src` allowance via `vercel.json` headers
- [ ] Ensure all API calls send credentials (axios `withCredentials: true` is already set in flows; verify globally)
- [ ] Confirm production build succeeds: `npm --prefix client ci && npm --prefix client run build`

### Stale service worker (one-time)
- [ ] If the old Heroku CRA service worker shares any reused domain, ship a self-unregistering `service-worker.js` (calls `registration.unregister()` + clears caches) for one release; otherwise N/A on fresh Vercel/Render domains

---

## Phase 2 — Provision the database (managed MySQL 8)
- [ ] Create a managed MySQL 8 instance in a region close to the Render region
- [ ] Create the app database (`CourseConnect`) and a **least-privilege** app user (no `SUPER`/admin)
- [ ] Enforce TLS-only connections; capture the CA cert / SSL requirement
- [ ] Restrict network access to Render's egress (allowlist) where supported
- [ ] Record `DB_HOST / DB_USER / DB_PASSWORD / DB_DATABASE` for the secret store
- [ ] Enable automated daily backups + retention; note PITR availability
- [ ] **Run a test restore** into a scratch DB to validate backups before go-live

---

## Phase 3 — Backend API on Render
- [ ] Create a **Web Service** from the GitHub repo (root = repo root; backend lives at root)
- [ ] Environment: Node; **Build Command** `npm ci`; **Start Command** `npm start`
- [ ] **Pre-Deploy Command**: `npx knex migrate:latest` (runs migrations before traffic shifts; requires `NODE_ENV=production`)
- [ ] Set instance region = DB region; choose plan (start small, autoscale later)
- [ ] Health check path: `/healthz`
- [ ] Add backend env vars (see matrix in Phase 6)
- [ ] First deploy → confirm logs show "Database connection successful" and the service is healthy
- [ ] Verify `GET https://<render-url>/healthz` returns `200`
- [ ] Verify `GET https://<render-url>/api/v1/categories/access-types` returns data

### `render.yaml` (optional, infra-as-code)
- [ ] Add a `render.yaml` defining the web service, env groups, pre-deploy migration, and health check path

---

## Phase 4 — Frontend on Vercel
- [ ] Import the GitHub repo into Vercel
- [ ] **Root Directory** = `client`
- [ ] Framework preset = Vite; **Build Command** `npm run build`; **Output Directory** `dist`; **Install** `npm ci`
- [ ] Add frontend env vars (build-time `VITE_*`, see matrix) — `VITE_ENV=production`, `VITE_BASE_URL=https://api.example.com`
- [ ] Confirm `client/vercel.json` SPA rewrites work (deep links like `/dashboard/c/<name>` don't 404 on refresh)
- [ ] First deploy → load the site, confirm fonts, dark/light toggle, and assets load over HTTPS
- [ ] Confirm the app calls the **Render API origin** (not localhost) in the network tab

---

## Phase 5 — Domain, TLS & cross-origin cookie wiring (critical)
- [ ] Point **`app.example.com`** (CNAME) → Vercel; add domain in Vercel; TLS auto-provisions
- [ ] Point **`api.example.com`** (CNAME) → Render; add custom domain in Render; TLS auto-provisions
- [ ] Force HTTPS + HSTS on both
- [ ] Set backend `CLIENT_URL=https://app.example.com` (CORS origin)
- [ ] Set backend `COOKIE_DOMAIN=.example.com` and cookie `sameSite: 'lax'` + `secure: true` (first-party across subdomains — avoids third-party cookie blocking)
- [ ] Set frontend `VITE_BASE_URL=https://api.example.com`, rebuild/redeploy Vercel
- [ ] **Cross-browser auth test** (Chrome **and** Safari): login on `app.…` → confirm the `jwt` cookie is set, sent on XHR to `api.…`, and `/auth/check-login` returns the user
- [ ] Verify CORS preflight (`OPTIONS`) succeeds with `Access-Control-Allow-Credentials: true` and exact origin echo

---

## Phase 6 — Configuration & secrets (env var matrix)
> Set in each host's secret manager. Never in git. Rotate anything that ever touched the repo.

### Render (backend)
- [ ] `NODE_ENV=production`
- [ ] `PORT` (provided by Render)
- [ ] `JWT_SECRET_KEY` (new ≥256-bit random; rotate old)
- [ ] `JWT_COOKIE_EXPIRES_IN` (days)
- [ ] `DB_HOST` / `DB_USER` / `DB_PASSWORD` / `DB_DATABASE`
- [ ] `DB_SSL=true`
- [ ] `CLIENT_URL=https://app.example.com`
- [ ] `COOKIE_DOMAIN=.example.com`

### Vercel (frontend, build-time)
- [ ] `VITE_ENV=production`
- [ ] `VITE_BASE_URL=https://api.example.com`

---

## Phase 7 — CI/CD
- [ ] Branch model: feature → `master`; deploy from `master`
- [ ] GitHub Actions on PR + main:
  - [ ] `npm ci` → `npm test` (Jest/Supertest) against a MySQL **service container** with migrations applied
  - [ ] `npm --prefix client ci && npm --prefix client run build` (catches build breakage incl. the JSX-in-`.js` Vite config)
  - [ ] Lint/format gate
  - [ ] `npm audit --production` (review the advisories surfaced during redesign)
- [ ] Render auto-deploys `master` (pre-deploy migration runs first)
- [ ] Vercel auto-deploys `master` (+ preview deploys per PR)
- [ ] Keep migrations **backward-compatible** (expand → migrate → contract) so rollback is safe
- [ ] Set up a **staging** environment (Render preview/service + Vercel preview + scratch DB) and promote to prod manually or on tag

---

## Phase 8 — Security hardening
- [ ] DB password + JWT secret rotated; scrub from git history if feasible (`git filter-repo`/BFG)
- [ ] Least-privilege DB user; TLS-only DB connections verified
- [ ] Cookies: `httpOnly` ✓, `secure` ✓, `sameSite`/`domain` set ✓
- [ ] Helmet enabled on API; explicit CSP if Express serves any HTML; HSTS on
- [ ] Rate limiter enabled globally + stricter on auth routes
- [ ] CORS locked to the exact frontend origin (no `*` with credentials)
- [ ] Secrets only in host secret stores; none baked into images or the client bundle
- [ ] Token expiry sane; consider refresh/rotation for long sessions

---

## Phase 9 — Observability & operations
- [ ] `/healthz` wired to Render health checks + an external uptime monitor
- [ ] Structured prod request logging to stdout (`morgan('combined')` or `pino`) → Render log drain
- [ ] Error tracking (Sentry) on backend **and** frontend, with release tagging
- [ ] Alerts: 5xx rate, p95 latency, DB connection failures, instance restarts
- [ ] DB metrics monitored: connections, slow queries, disk
- [ ] Knex `pool: { min, max }` set for `production` (sized to instance concurrency vs DB connection cap)
- [ ] Compression (gzip/brotli) at proxy or via `compression` middleware

---

## Phase 10 — Staging verification / smoke tests
> Run the full path on staging before touching prod.
- [ ] Signup → email/password login → **cookie set over HTTPS** (check Application tab)
- [ ] `check-login` returns the user after refresh (session persists)
- [ ] Create community → create thread (course + discussion) → upvote/downvote → save
- [ ] Comment + nested reply; vote on comments
- [ ] Join flow + join-requests approve/reject
- [ ] Search, saved threads, filters
- [ ] Logout clears the cookie (verify in Safari **and** Chrome)
- [ ] Dark/light theme toggle persists; mobile drawer + responsive layouts
- [ ] Deep-link refresh works (SPA rewrites); 404/no-access states render

---

## Phase 11 — Production cutover
- [ ] All Phase 1 blockers merged to `master`
- [ ] Prod env vars set on Render + Vercel; secrets verified, none in git
- [ ] CI green; migrations applied cleanly via pre-deploy
- [ ] Custom domains live with forced HTTPS + HSTS on both tiers
- [ ] Cross-browser auth confirmed in prod
- [ ] Health checks, logging, error tracking, uptime alerts live
- [ ] Rollback rehearsed (Render previous-deploy redeploy; Vercel instant rollback; DB N-1 compatible)
- [ ] Backups verified by a test restore
- [ ] Announce go-live; monitor dashboards for the first hours

---

## Phase 12 — Post-launch
- [ ] Watch error rates, latency, DB load for 48h
- [ ] Tune Knex pool + Render instance size / autoscaling from real traffic
- [ ] Schedule dependency + `npm audit` review cadence
- [ ] Document the deploy + rollback runbook (RTO/RPO targets)
- [ ] Backlog: CDN cache tuning, refresh tokens, seed/demo data strategy

---

### Top risks to keep front-of-mind
1. **Third-party cookie blocking** on split origins → use shared `example.com` subdomains (Phase 5).
2. **Build-time frontend env** — `VITE_BASE_URL` is inlined at `vite build`; changing the API URL requires a **Vercel redeploy**, not just an env edit.
3. **Migrations in release phase** with `NODE_ENV=production` — verify Knex picks the `production` config and SSL connects.
4. **Committed dev DB password** in `knexfile.js` — rotate + purge.
