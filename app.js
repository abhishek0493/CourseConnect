const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

require('dotenv').config();

const db = require('./db');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const commRouter = require('./routes/communites');
const miscRouter = require('./routes/misc');
const threadsRouter = require('./routes/threads');
const commentRouter = require('./routes/comments');
const dashboardRouter = require('./routes/dashboard');
const globalErrorHandler = require('./middleware/errorHandler');

// Start express app
const app = express();

const isProd = process.env.NODE_ENV === 'production';
const clientDist = path.join(__dirname, 'client', 'dist');

// Trust the platform proxy (Render/Heroku) so req.secure, secure cookies,
// and per-IP rate limiting work correctly behind TLS termination.
app.set('trust proxy', 1);

// 1) GLOBAL MIDDLEWARES

// CORS — same-origin in the monolith; still needed for local dev (client :3000 -> api :8000).
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Security HTTP headers + a Content-Security-Policy that allows the SPA's
// fonts/styles/assets. Express serves the built SPA in production, so the CSP
// must permit Google Fonts (or self-host the fonts and tighten this further).
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'img-src': ["'self'", 'data:', 'blob:'],
        'connect-src': ["'self'"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
      },
    },
    // Allow same-origin asset loading without COEP friction for the SPA.
    crossOriginEmbedderPolicy: false,
  })
);

// Gzip/brotli compression for API responses and static assets.
app.use(compression());

// Serve the built Vite SPA (production). Hashed assets are immutable;
// index.html must never be long-cached so deploys take effect immediately.
app.use(
  express.static(clientDist, {
    maxAge: '1y',
    index: false,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

// Development request logging
if (!isProd) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting: a sane global cap, plus a stricter cap on auth endpoints.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts, please try again later.',
});
app.use('/api/v1/auth', authLimiter);
app.use('/api', apiLimiter);

// Body parser, reading data from body into req.body
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// Request timestamp
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) HEALTH CHECK (used by the Render health probe & uptime monitors)
app.get('/healthz', async (req, res) => {
  try {
    await db.raw('SELECT 1');
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(503).json({ status: 'error', message: 'database unavailable' });
  }
});

// 3) API ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/community', commRouter);
app.use('/api/v1/categories', miscRouter);
app.use('/api/v1/threads', threadsRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/dashboard', dashboardRouter);

// 4) SPA FALLBACK — serve the React app for any non-API route.
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.use(globalErrorHandler);

module.exports = app;
