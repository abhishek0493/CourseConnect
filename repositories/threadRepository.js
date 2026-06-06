const db = require('../db');

// ─── Thread Queries ────────────────────────────────────────────────────────────

const findById = async (id) => {
  return db('threads').where('id', id).first();
};

const findWithCommunity = async (id) => {
  return db('threads as t')
    .select('t.*', 'u.name as thread_author', 'c.access_type', 'c.created_by')
    .join('communities as c', 'c.id', '=', 't.community_id')
    .join('users as u', 'u.id', '=', 't.user_id')
    .where('t.id', id)
    .first();
};

const create = async (data) => {
  const [id] = await db('threads').insert(data);
  return id;
};

const incrementThread = async (id, increments) => {
  return db('threads').where({ id }).increment(increments);
};

// ─── Community Thread Listing ──────────────────────────────────────────────────

const findCommunityThreads = async (communityName, isSaved, isCourse, isPosted, userId) => {
  let query = db('threads as t')
    .select(
      't.*',
      'u.name as thread_author',
      'uc.name as community_author',
      'c.category_id',
      'c.name',
      'c.description',
      'c.access_type'
    )
    .select(db.raw('COUNT(comments.id) as total_comments'))
    .join('communities as c', 'c.id', '=', 't.community_id')
    .join('users as u', 'u.id', '=', 't.user_id')
    .join('users as uc', 'uc.id', '=', 'c.created_by')
    .leftJoin('comments', 'comments.thread_id', '=', 't.id')
    .andWhere('c.name', communityName)
    .groupBy(
      't.id',
      'u.name',
      'uc.name',
      'c.category_id',
      'c.name',
      'c.description',
      'c.access_type'
    )
    .orderBy('t.id', 'desc');

  if (isSaved && isSaved == 1) {
    query = query.join('user_thread_actions as uta', function () {
      this.on('t.id', '=', 'uta.thread_id')
        .andOn('uta.is_saved', 1)
        .andOn('uta.user_id', userId);
    });
  }

  if (isCourse && isCourse == 1) {
    query = query.andWhere('t.type', 1);
  }

  if (isPosted && isPosted == 1) {
    query = query.andWhere('t.user_id', userId);
  }

  return query;
};

// ─── Dashboard Queries ─────────────────────────────────────────────────────────

const getTrendingThreads = async (userId, { isSaved, isCourse, isCategory, isAuthorPosted } = {}) => {
  let query = db('threads as t')
    .select(
      't.*',
      'u.name as author',
      'c.category_id',
      'c.name',
      'c.description',
      'c.access_type',
      'c.created_by',
      'c.category_id',
      'c.name as community_name',
      'uta.is_saved',
      'uta.is_upvoted',
      'uta.is_downvoted'
    )
    .select(db.raw('COUNT(comments.id) as total_comments'))
    .join('communities as c', 'c.id', '=', 't.community_id')
    .join('users as u', 'u.id', '=', 't.user_id')
    .join('users as uc', 'uc.id', '=', 'c.created_by')
    .leftJoin('comments', 'comments.thread_id', '=', 't.id')
    .leftJoin('user_thread_actions as uta', function () {
      this.on('uta.thread_id', '=', 't.id').andOn('uta.user_id', '=', userId);
    })
    .whereIn('c.access_type', [1, 2])
    .groupBy(
      't.id',
      'u.name',
      'c.category_id',
      'c.name',
      'c.description',
      'c.access_type',
      'c.category_id',
      'c.created_by',
      'uta.is_saved',
      'uta.is_upvoted',
      'uta.is_downvoted'
    )
    .having('total_comments', '>', 1)
    .orderBy('t.id', 'desc');

  if (isSaved && isSaved == 1) query = query.andWhere('uta.is_saved', 1);
  if (isCourse && isCourse == 1) query = query.andWhere('t.type', 1);
  if (isCategory && isCategory != 0) query = query.andWhere('c.category_id', isCategory);
  if (isAuthorPosted && isAuthorPosted == 1) query = query.andWhere('t.user_id', userId);

  return query;
};

const getSavedThreads = async (userId) => {
  return db('threads as t')
    .select(
      't.*',
      'u.name as author',
      'c.category_id',
      'c.name',
      'c.description',
      'c.access_type',
      'c.created_by',
      'c.category_id',
      'c.name as community_name',
      'uta.is_saved',
      'uta.is_upvoted',
      'uta.is_downvoted'
    )
    .select(db.raw('COUNT(comments.id) as total_comments'))
    .join('communities as c', 'c.id', '=', 't.community_id')
    .join('users as u', 'u.id', '=', 't.user_id')
    .join('users as uc', 'uc.id', '=', 'c.created_by')
    .leftJoin('comments', 'comments.thread_id', '=', 't.id')
    .leftJoin('user_thread_actions as uta', function () {
      this.on('uta.thread_id', '=', 't.id').andOn('uta.user_id', '=', userId);
    })
    .where('uta.is_saved', 1)
    .groupBy(
      't.id',
      'u.name',
      'c.category_id',
      'c.name',
      'c.description',
      'c.access_type',
      'c.category_id',
      'c.created_by',
      'uta.is_saved',
      'uta.is_upvoted',
      'uta.is_downvoted'
    )
    .orderBy('t.id', 'desc');
};

const searchThreads = async (userId, query) => {
  return db('threads as t')
    .select(
      't.*',
      'u.name as author',
      'c.category_id',
      'c.name',
      'c.description',
      'c.access_type',
      'c.created_by',
      'c.category_id',
      'c.name as community_name',
      'uta.is_saved',
      'uta.is_upvoted',
      'uta.is_downvoted'
    )
    .select(db.raw('COUNT(comments.id) as total_comments'))
    .join('communities as c', 'c.id', '=', 't.community_id')
    .join('users as u', 'u.id', '=', 't.user_id')
    .join('users as uc', 'uc.id', '=', 'c.created_by')
    .leftJoin('comments', 'comments.thread_id', '=', 't.id')
    .leftJoin('user_thread_actions as uta', function () {
      this.on('uta.thread_id', '=', 't.id').andOn('uta.user_id', '=', userId);
    })
    .where('c.name', 'like', `%${query}%`)
    .orWhere('t.title', 'like', `%${query}%`)
    .groupBy(
      't.id',
      'u.name',
      'c.category_id',
      'c.name',
      'c.description',
      'c.access_type',
      'c.category_id',
      'c.created_by',
      'uta.is_saved',
      'uta.is_upvoted',
      'uta.is_downvoted'
    )
    .orderBy('t.id', 'desc');
};

const getRecentCommunities = async () => {
  return db('communities as c')
    .select(
      'c.name as community_name',
      'ct.name as category_name',
      'c.category_id',
      'c.access_type',
      db.raw(
        `(SELECT COUNT(*) FROM user_communities as uc WHERE uc.status = 1 AND uc.is_author != 1 AND uc.community_id = c.id) as total_users`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM threads as t WHERE t.community_id = c.id) as total_threads`
      )
    )
    .join('categories as ct', 'ct.id', '=', 'c.category_id')
    .orderBy('total_users', 'desc')
    .orderBy('total_threads', 'desc')
    .limit(9);
};

// ─── Thread Actions ────────────────────────────────────────────────────────────

const getUserThreadActions = async (userId) => {
  return db('user_thread_actions').where('user_id', userId);
};

const getThreadAction = async (userId, threadId) => {
  return db('user_thread_actions')
    .where({ user_id: userId, thread_id: threadId })
    .first();
};

const insertThreadAction = async (data) => {
  return db('user_thread_actions').insert(data);
};

const updateThreadAction = async (userId, threadId, update) => {
  return db('user_thread_actions')
    .where({ user_id: userId, thread_id: threadId })
    .update(update);
};

// ─── Nested Comments (raw SQL) ─────────────────────────────────────────────────

const getNestedComments = async (threadId) => {
  const [rows] = await db.raw(`
    WITH RECURSIVE comment_hierarchy AS (
      SELECT
        c.id,
        c.user_id,
        c.thread_id,
        c.created_at,
        c.comment,
        c.parent_comment_id,
        c.total_upvotes,
        c.total_downvotes,
        0 AS depth,
        u.name AS user_name
      FROM
        comments c
        INNER JOIN users u ON c.user_id = u.id
      WHERE
        c.thread_id = ${threadId} AND c.parent_comment_id = 0
      UNION ALL
      SELECT
        c.id,
        c.user_id,
        c.thread_id,
        c.created_at,
        c.comment,
        c.parent_comment_id,
        c.total_upvotes,
        c.total_downvotes,
        ch.depth + 1,
        u.name AS user_name
      FROM
        comments c
        INNER JOIN comment_hierarchy ch ON c.parent_comment_id = ch.id
        INNER JOIN users u ON c.user_id = u.id
    )
    SELECT
      id,
      user_id,
      thread_id,
      parent_comment_id,
      created_at,
      comment,
      total_upvotes,
      total_downvotes,
      depth,
      user_name
    FROM
      comment_hierarchy
    ORDER BY
      depth DESC;
  `);
  return rows;
};

module.exports = {
  findById,
  findWithCommunity,
  create,
  incrementThread,
  findCommunityThreads,
  getTrendingThreads,
  getSavedThreads,
  searchThreads,
  getRecentCommunities,
  getUserThreadActions,
  getThreadAction,
  insertThreadAction,
  updateThreadAction,
  getNestedComments,
};
