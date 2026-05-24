const knex = require('knex');
const knexConfig = require('./knexfile');
const db =
  process.env.NODE_ENV === 'production'
    ? knex(knexConfig.production)
    : knex(knexConfig.development);

db.raw('SELECT 1')
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });

module.exports = db;
