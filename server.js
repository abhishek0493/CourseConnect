require('dotenv').config({ path: require('path').join(__dirname, '.env') });

// Validate required env vars before anything else — refuse to start (rather than
// fail mid-request with a generic 500) if e.g. JWT_SECRET_KEY is unset.
require('./utils/validateEnv')();

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
