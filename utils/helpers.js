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

exports.refactorResponse = (data) => {
  return data.map((row) => {
    return { ...row };
  });
};

exports.checkIfUserCommunityExists = async (user_id, thread_id) => {
  const community = await db('user_communities')
    .where('thread_id', thread_id)
    .andWhere('user_id', user_id)
    .andWhere(function () {
      this.where('is_author', 1).orWhere('is_');
    });
};
