const db = require('../db');
const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');

const getRecentCommunites = catchAsync(async (req, res) => {
  const communities = await db('communities as c')
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

  res.status(200).json({
    success: true,
    data: communities,
  });
});

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
      this.on('uta.thread_id', '=', 't.id').andOn(
        'uta.user_id',
        '=',
        loggedInUser
      );
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

  if (isSaved && isSaved == 1) {
    threadsQuery = threadsQuery.andWhere('uta.is_saved', 1);
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

    return {
      ...thread,
      is_joined: isJoined ? 1 : 0,
      is_request_pending: isRequestPending ? 1 : 0,
      is_author: isAuthor,
      is_creator: isCreator,
    };
  });

  res.status(200).json({
    success: true,
    data: transformThreads,
  });
});

const getAllSavedThreads = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;

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
      this.on('uta.thread_id', '=', 't.id').andOn(
        'uta.user_id',
        '=',
        loggedInUser
      );
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

  const threads = await threadsQuery;

  const transformThreads = threads.map((thread) => {
    const isAuthor = thread.user_id == loggedInUser ? 1 : 0;
    const isCreator = thread.created_by == loggedInUser ? 1 : 0;

    return {
      ...thread,
      is_author: isAuthor,
      is_creator: isCreator,
    };
  });

  res.status(200).json({
    success: true,
    data: transformThreads,
  });
});

const getSearchQueryThreads = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const { query } = req.query;

  const threads = await db('threads as t')
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
      this.on('uta.thread_id', '=', 't.id').andOn(
        'uta.user_id',
        '=',
        loggedInUser
      );
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

  if (!threads) {
    res.status(400).json({
      success: false,
      message: 'No Results Found',
    });
  }

  const userCommunities = await db('user_communities').where(
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

    return {
      ...thread,
      is_joined: isJoined ? 1 : 0,
      is_request_pending: isRequestPending ? 1 : 0,
      is_author: isAuthor,
      is_creator: isCreator,
    };
  });

  res.status(200).json({
    success: true,
    data: transformThreads,
  });
});

module.exports = {
  getTrendingThreads,
  getRecentCommunites,
  getAllSavedThreads,
  getSearchQueryThreads,
};
