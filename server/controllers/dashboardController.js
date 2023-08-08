const db = require('../db');
const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');

const getTrendingThreads = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const { isSaved, isCategory, isCourse, isAuthorPosted } = req.query;

  let threadsQuery = db('threads as t')
    .select(
      't.*',
      'u.name as author',
      'c.category_id',
      'c.name',
      'c.description',
      'c.access_type',
      'c.created_by',
      'c.category_id',
      'c.name as community_name'
    )
    .select(db.raw('COUNT(comments.id) as total_comments'))
    .join('communities as c', 'c.id', '=', 't.community_id')
    .join('users as u', 'u.id', '=', 't.user_id')
    .join('users as uc', 'uc.id', '=', 'c.created_by')
    .leftJoin('comments', 'comments.thread_id', '=', 't.id')
    .whereIn('c.access_type', [1, 2])
    .groupBy(
      't.id',
      'u.name',
      'c.category_id',
      'c.name',
      'c.description',
      'c.access_type',
      'c.category_id',
      'c.created_by'
    )
    .having('total_comments', '>', 1)
    .orderBy('t.id', 'desc');

  if (isSaved && isSaved == 1) {
    threadsQuery = threadsQuery.join('user_thread_actions as uta', function () {
      this.on('t.id', '=', 'uta.thread_id')
        .andOn('uta.is_saved', 1)
        .andOn('uta.user_id', loggedInUser);
    });
  }

  if (isCourse && isCourse == 1) {
    threadsQuery = threadsQuery.andWhere('t.type', 1);
  }

  if (isCategory && isCategory != 0) {
    threadsQuery = threadsQuery.andWhere('c.category_id', isCategory);
  }

  if (isAuthorPosted && isAuthorPosted == 1) {
    threadsQuery = threadsQuery.andWhere('t.user_id', loggedInUser);
  }

  const threads = await threadsQuery;

  const userCommunities = await db('user_communities').where(
    'user_id',
    loggedInUser
  );

  const userThreadActions = await db('user_thread_actions').where(
    'user_id',
    loggedInUser
  );

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

    const isAuthor = thread.user_id == loggedInUser ? 1 : 0;
    const isCreator = thread.created_by == loggedInUser ? 1 : 0;

    const isSaved = userThreadActions.some(
      (action) => action.thread_id === thread.id && action.is_saved
    );
    const isUpvoted = userThreadActions.some(
      (action) => action.thread_id === thread.id && action.is_upvoted
    );
    const isDownvoted = userThreadActions.some(
      (action) => action.thread_id === thread.id && action.is_downvoted
    );

    return {
      ...thread,
      is_joined: isJoined ? 1 : 0,
      is_request_pending: isRequestPending ? 1 : 0,
      is_author: isAuthor,
      is_creator: isCreator,
      is_saved: isSaved ? 1 : 0,
      is_upvoted: isUpvoted ? 1 : 0,
      is_downvoted: isDownvoted ? 1 : 0,
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
