const db = require('../db');
const crypto = require('crypto');

exports.checkIfUserExistsByEmail = async (email) => {
  const user = await db('users').where({ email: email }).first();
  if (user !== undefined) return { exists: true };
  return { exists: false };
};

exports.generateRandomKey = (length = 20) => {
  return crypto.randomBytes(length).toString('hex');
};
