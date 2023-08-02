const db = require('../db');
const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');

const getTrendingThreads = catchAsync(async (req, res) => {
  const threads = await db('threads as t')
    .select(
      't.*',
      'u.name as author',
      'c.category_id',
      'uc.is_author',
      'uc.status',
      'c.name',
      'c.description',
      'c.access_type',
      'c.name as community_name'
    )
    .select(db.raw('COUNT(comments.id) as total_comments'))
    .join('communities as c', 'c.id', '=', 't.community_id')
    .join('user_communities as uc', 'uc.community_id', '=', 'c.id')
    .join('users as u', 'u.id', '=', 't.user_id')
    .leftJoin('comments', 'comments.thread_id', '=', 't.id')
    .whereIn('c.access_type', [1, 2])
    .groupBy(
      't.id',
      'u.name',
      'c.category_id',
      'uc.is_author',
      'uc.status',
      'c.name',
      'c.description',
      'c.access_type'
    )
    .having('total_comments', '>', 2)
    .orderBy('t.id', 'desc');

  res.status(200).json({
    success: true,
    data: threads,
  });
});

module.exports = {
  getTrendingThreads,
};
