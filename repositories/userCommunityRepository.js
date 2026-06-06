const db = require('../db');

const findById = async (id) => {
  return db('user_communities').where({ id }).first();
};

const findAllRequests = async (userId, communityName) => {
  let query = db('user_communities as uc')
    .select('uc.*', 'u.name as request_user', 'c.name', 'c.access_type')
    .join('communities as c', 'c.id', '=', 'uc.community_id')
    .join('users as u', 'u.id', '=', 'uc.user_id')
    .where('c.created_by', userId)
    .andWhere('c.access_type', '!=', 1)
    .andWhere('uc.status', '!=', 1)
    .andWhere('uc.is_author', '!=', 1);

  if (communityName) {
    query = query.andWhere('c.name', communityName);
  }

  return query;
};

const updateStatus = async (id, status) => {
  return db('user_communities').where('id', id).update({ status });
};

const findByUserAndCommunity = async (userId, communityId) => {
  return db('user_communities')
    .where({ user_id: userId, community_id: communityId })
    .first();
};

module.exports = {
  findById,
  findAllRequests,
  updateStatus,
  findByUserAndCommunity,
};
