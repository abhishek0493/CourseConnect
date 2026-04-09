const db = require('../db');

const findByEmail = async (email) => {
  return db('users').where({ email }).first();
};

const findByUuid = async (uuid) => {
  return db('users')
    .select('name', 'id', 'uuid', 'type', 'email')
    .where({ uuid })
    .first();
};

const findById = async (id) => {
  return db('users').where({ id }).first();
};

const create = async (data) => {
  const [id] = await db('users').insert(data);
  return id;
};

const getUuidById = async (id) => {
  const row = await db('users').where({ id }).select('uuid').first();
  return row ? row.uuid : null;
};

const getStats = async (userId) => {
  return db('users as u')
    .select(
      'u.name',
      db.raw(
        `(SELECT COUNT(*) FROM user_communities as uc WHERE uc.status = 1 AND uc.is_author != 1 AND uc.user_id = ${userId}) as total_communities_joined`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM communities as c WHERE c.created_by = ${userId}) as total_communities_created`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM threads as c WHERE c.user_id = ${userId}) as total_threads_created`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM comments as cmt WHERE cmt.user_id = ${userId} AND parent_comment_id = 0) as total_comments`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM comments as cmt WHERE cmt.user_id = ${userId} AND parent_comment_id != 0) as total_replies`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM user_communities as ucr WHERE ucr.community_id IN (SELECT c.id FROM communities as c WHERE c.created_by = ${userId} AND c.access_type != 1) AND ucr.is_author != 1 AND ucr.status = 0) as total_requests`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM user_thread_actions as uta WHERE uta.thread_id IN (SELECT t.id FROM threads as t WHERE t.user_id = ${userId}) AND uta.is_upvoted = 1 AND uta.user_id != ${userId}) as total_upvotes`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM user_thread_actions as uta WHERE uta.thread_id IN (SELECT t.id FROM threads as t WHERE t.user_id = ${userId}) AND uta.is_downvoted = 1 AND uta.user_id != ${userId}) as total_downvotes`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM user_thread_actions as uta WHERE uta.user_id = ${userId} AND uta.is_saved = 1) as total_saved`
      )
    )
    .where({ id: userId });
};

module.exports = {
  findByEmail,
  findByUuid,
  findById,
  create,
  getUuidById,
  getStats,
};
