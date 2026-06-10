// Fail-fast environment validation.
//
// Some env vars are only read deep inside a request (e.g. JWT_SECRET_KEY during
// token signing). If they're missing, the app boots fine and then throws a
// generic 500 on the first login/signup — which looks like a code bug but is
// really a misconfigured deploy. Validating at startup turns that into an
// obvious, immediate crash with a clear message instead.

// Vars the server cannot function without, in any environment.
const REQUIRED = ['JWT_SECRET_KEY'];

// Vars required only when running in production (managed DB, TLS, etc.).
const REQUIRED_IN_PRODUCTION = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_DATABASE',
];

const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';

const validateEnv = () => {
  const isProd = process.env.NODE_ENV === 'production';
  const keys = [...REQUIRED, ...(isProd ? REQUIRED_IN_PRODUCTION : [])];

  const missing = keys.filter((key) => isBlank(process.env[key]));

  if (missing.length > 0) {
    console.error(
      `FATAL: missing required environment variable(s): ${missing.join(', ')}.\n` +
        'Set these in your environment (in production, the Render dashboard) and redeploy.',
    );
    process.exit(1);
  }
};

module.exports = validateEnv;
