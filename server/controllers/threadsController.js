const db = require('../db');
const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const { threadCreationSchema } = require('../utils/validation');

const getCommunityUserThreads = catchAsync(async (req, res) => {
  const community = req.params.community;
  const loggedInUser = req.user.id;

  const threads = await db('threads as t')
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
    .andWhere('c.name', community)
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

  const userCommunities = await db('user_communities').where(
    'user_id',
    loggedInUser
  );

  const transformThreads = threads.map((thread) => {
    const isAuthor = thread.user_id == loggedInUser ? 1 : 0;
    return {
      ...thread,
      is_author: isAuthor,
    };
  });

  if (threads) {
    res.status(200).json({
      success: true,
      data: transformThreads,
    });
  }
});

const createThread = catchAsync(async (req, res) => {
  const { error } = threadCreationSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });

  const data = req.body;
  const loggedInUser = req.user.id;

  const id = await db('threads').insert({
    community_id: data.community,
    user_id: loggedInUser,
    title: data.title,
    type: data.type,
    source: data.source,
    pricing: data.pricing,
    link: data.link,
    body: data.body,
    is_course_completed: data.is_completed ? 1 : 0,
    author_rating: data.rating,
  });

  const community = await db('communities').where('id', data.community).first();

  return res.status(200).json({
    success: true,
    data: {
      id: id,
      name: community.name,
    },
  });
});

const getThreadDetails = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const id = req.params.id;
  const thread = await db('threads').where('id', id).first();
  if (!thread) {
    res.status(401).json({
      success: false,
      message: 'No result found',
    });
  }

  const comments = await db('comments').where('thread_id', thread.id);
  let arr = [];

  res.status(200).json({
    success: true,
    data: thread,
  });
});

const getThreadWithNestedComments = async (req, res) => {
  // Execute the SQL query to retrieve the comments and their hierarchy
  let commentsData = await db.raw(`
    WITH RECURSIVE comment_hierarchy AS (
      SELECT
        c.id,
        c.user_id,
        c.thread_id,
        c.created_at,
        c.comment,
        c.parent_comment_id,
        0 AS depth,
        u.name AS user_name
      FROM
        comments c
        INNER JOIN users u ON c.user_id = u.id
      WHERE
        c.thread_id = ${req.params.id} AND c.parent_comment_id = 0
      UNION ALL
      SELECT
        c.id,
        c.user_id,
        c.thread_id,
        c.created_at,
        c.comment,
        c.parent_comment_id,
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
      depth,
      user_name
    FROM
      comment_hierarchy
    ORDER BY
      depth DESC;
  `);

  commentsData = commentsData[0];

  // Create a dictionary/map to store comments based on their IDs
  const commentsMap = new Map();
  for (const comment of commentsData) {
    commentsMap.set(comment.id, {
      id: comment.id,
      thread_id: comment.thread_id,
      parent_comment_id: comment.parent_comment_id,
      author: comment.user_name,
      depth: comment.depth,
      created_at: comment.created_at,
      comment: comment.comment,
      comments: [], // Initialize an empty array for nested comments
    });
  }

  let rootComments = [];
  for (const comment of commentsData) {
    if (comment.parent_comment_id === 0) {
      // If the comment is a root comment (no parent), add it directly to the rootComments array
      rootComments.push(commentsMap.get(comment.id));
    } else {
      // If the comment has a parent, add it as a nested comment to its parent
      const parentComment = commentsMap.get(comment.parent_comment_id);
      if (parentComment) {
        parentComment.comments.push(commentsMap.get(comment.id));
      }
    }
  }

  let thread = await db('threads as t')
    .select('t.*', 'u.name as creator')
    .join('users as u', 'u.id', '=', 't.user_id')
    .where('t.id', req.params.id)
    .first();

  const transformedRes = {
    thread: thread,
    comments: rootComments,
  };

  res.status(200).json({
    success: true,
    data: transformedRes,
  });
};

const upVoteThread = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const thread = req.params.id;
  const threadAction = await db('user_thread_actions')
    .where({ user_id: loggedInUser, thread_id: thread })
    .first();

  if (!threadAction) {
    const newRow = await db('user_thread_actions').insert({
      user_id: loggedInUser,
      thread_id: thread,
      is_upvoted: 1,
    });

    const incrementThreadCount = await db('threads')
      .where({ id: thread })
      .increment('total_upvotes', 1);

    res.status(200).json({
      success: true,
      data: newRow,
    });
  }

  if (!threadAction.is_upvoted) {
    await db('user_thread_actions')
      .where({ user_id: loggedInUser, thread_id: thread })
      .update({ is_upvoted: 1, is_downvoted: 0 });

    await db('threads').where({ id: thread }).increment('total_upvotes', 1);

    res.status(200).json({
      success: true,
      data: 'Thread up-voted successfully',
    });
  }

  res.status(401).json({
    success: false,
    message: 'This thread is already up-voted by you',
  });
});

const downVoteThread = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const thread = req.params.id;
  const threadAction = await db('user_thread_actions')
    .where({ user_id: loggedInUser, thread_id: thread })
    .first();

  if (!threadAction) {
    const newRow = await db('user_thread_actions').insert({
      user_id: loggedInUser,
      thread_id: thread,
      is_downvoted: 1,
    });

    const incrementDownVoteCount = await db('threads')
      .where({ id: thread })
      .increment('total_downvotes', 1);

    res.status(200).json({
      success: true,
      data: newRow,
    });
  }

  if (!threadAction.is_downvoted) {
    await db('user_thread_actions')
      .where({ user_id: loggedInUser, thread_id: thread })
      .update({ is_downvoted: 1, is_upvoted: 0 });

    await db('threads').where({ id: thread }).increment('total_downvotes', 1);

    res.status(200).json({
      success: true,
      data: 'Thread down-voted successfully',
    });
  }

  res.status(401).json({
    success: false,
    message: 'This thread is already down-voted by you',
  });
});

module.exports = {
  getCommunityUserThreads,
  getThreadWithNestedComments,
  getThreadDetails,
  createThread,
  upVoteThread,
  downVoteThread,
};
