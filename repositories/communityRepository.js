const db = require('../db');

const findByName = async (name) => {
  return db('communities as c')
    .join('users as u', 'u.id', '=', 'c.created_by')
    .select('c.*', 'u.name as author_name')
    .where('c.name', name)
    .first()
    .select(
      db.raw(
        '(SELECT COUNT(*) FROM user_communities WHERE community_id = c.id AND status = 1) as total_joined_users'
      )
    );
};

const findUserCommunities = async (userId) => {
  return db('user_communities as uc')
    .join('communities as c', 'c.id', 'uc.community_id')
    .where('uc.user_id', '=', userId)
    .andWhere(function () {
      this.where('uc.is_author', '=', 1).orWhere('uc.status', '=', 1);
    })
    .orderBy('c.id', 'desc');
};

const findUserMembership = async (userId, communityId) => {
  return db('user_communities')
    .where({ user_id: userId, community_id: communityId })
    .first();
};

const checkNameExists = async (name) => {
  const existing = await db('communities').where('name', name).first();
  return !!existing;
};

const create = async (data) => {
  const [id] = await db('communities').insert(data);
  return id;
};

const addUserCommunity = async (data) => {
  const [id] = await db('user_communities').insert(data);
  return id;
};

const updateUserCommunity = async (whereObj, update) => {
  return db('user_communities').where(whereObj).update(update);
};

const findById = async (id) => {
  return db('communities').where('id', id).first();
};

const findWithUserMembership = async (name, userId) => {
  return db('communities as c')
    .select('c.*', 'uc.is_author', 'uc.status')
    .leftJoin('user_communities as uc', function () {
      this.on('uc.community_id', '=', 'c.id').andOn(
        'uc.user_id',
        '=',
        userId
      );
    })
    .where('c.name', name)
    .first();
};

module.exports = {
  findByName,
  findUserCommunities,
  findUserMembership,
  checkNameExists,
  create,
  addUserCommunity,
  updateUserCommunity,
  findById,
  findWithUserMembership,
};
