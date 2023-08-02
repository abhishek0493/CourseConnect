const db = require('../db');
const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');

const getTrendingThreads = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const threads = await db('threads as t')
    .select(
      't.*',
      'u.name as author',
      'c.category_id',
      'c.name',
      'c.description',
      'c.access_type',
      'c.name as community_name'
    )
    .select(db.raw('COUNT(comments.id) as total_comments'))
    .join('communities as c', 'c.id', '=', 't.community_id')
    .join('users as u', 'u.id', '=', 't.user_id')
    .leftJoin('comments', 'comments.thread_id', '=', 't.id')
    .whereIn('c.access_type', [1, 2])
    .groupBy(
      't.id',
      'u.name',
      'c.category_id',
      'c.name',
      'c.description',
      'c.access_type'
    )
    .having('total_comments', '>', 2)
    .orderBy('t.id', 'desc');

  const userCommunities = await db('user_communities').where(
    'user_id',
    loggedInUser
  );

  // return res.status(200).json({
  //   data: userCommunities,
  // });

  const transformThreads = threads.map((thread) => {
    const isJoined = userCommunities.some(
      (uc) =>
        uc.community_id == thread.community_id &&
        uc.status == 1 &&
        uc.is_author != 1
    );

    const isRequestPending = userCommunities.some(
      (uc) =>
        uc.community_id == thread.community_id &&
        uc.status == 0 &&
        uc.is_author != 1
    );

    return {
      ...thread,
      is_joined: isJoined ? 1 : 0,
      is_request_pending: isRequestPending ? 1 : 0,
    };
  });

  res.status(200).json({
    success: true,
    data: transformThreads,
  });
});

module.exports = {
  getTrendingThreads,
};
