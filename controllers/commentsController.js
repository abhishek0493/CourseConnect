const db = require('../db');
const catchAsync = require('../utils/catchAsync');
const helper = require('../utils/helpers');
const { commentCreationSchema } = require('../utils/validation');

const createTheadComment = catchAsync(async (req, res) => {
  const { error } = commentCreationSchema.validate(req.body);

  if (error)
    res.status(400).json({
      success: false,
      message: error.details[0].message,
    });

  const loggedInUser = req.user.id;
  const threadID = req.params.thread_id;

  const thread = await db('threads').where('id', threadID).first();
  const comment = await db('comments').insert({
    thread_id: thread.id,
    user_id: loggedInUser,
    comment: req.body.comment,
  });

  res.status(200).json({
    success: true,
    data: comment,
  });
});

const createCommentReply = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const threadID = req.params.thread_id;
  const commentID = req.params.comment_id;

  const thread = await db('threads').where('id', threadID).first();
  const comment = await db('comments').insert({
    thread_id: thread.id,
    parent_comment_id: commentID,
    user_id: loggedInUser,
    comment: req.body.comment,
  });

  res.status(200).json({
    success: true,
    data: comment,
  });
});

const upVoteComment = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const commentID = req.params.id;

  const commentAction = await db('user_comment_actions')
    .where({
      user_id: loggedInUser,
      comment_id: commentID,
    })
    .first();

  if (!commentAction) {
    const newRow = await db('user_comment_actions').insert({
      user_id: loggedInUser,
      comment_id: commentID,
      is_upvoted: 1,
    });

    const incrementCommentCount = await db('comments')
      .where({ id: commentID })
      .increment('total_upvotes', 1);

    return res.status(200).json({
      success: true,
      data: {
        toggle: false,
        message: 'Comment up-voted successfully',
      },
    });
  }

  if (!commentAction.is_upvoted && commentAction.is_downvoted) {
    await db('user_comment_actions')
      .where({ user_id: loggedInUser, comment_id: commentID })
      .update({ is_upvoted: 1, is_downvoted: 0 });

    await db('comments')
      .where({ id: commentID })
      .increment({ total_upvotes: 1, total_downvotes: -1 });

    return res.status(200).json({
      success: true,
      data: {
        toggle: true,
        message: 'Comment up-voted successfully',
      },
    });
  }

  if (!commentAction.is_upvoted && !commentAction.is_downvoted) {
    await db('user_comment_actions')
      .where({
        user_id: loggedInUser,
        comment_id: commentID,
      })
      .update({
        is_upvoted: 1,
      });

    await db('comments')
      .where({ id: commentID })
      .increment({ total_upvotes: 1 });

    return res.status(200).json({
      success: true,
      data: {
        toggle: false,
        message: 'Comment up-voted successfully',
      },
    });
  }

  res.status(401).json({
    success: false,
    message: 'This comment is already up-voted by you',
  });
});

const downVoteComment = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const commentID = req.params.id;
  const commentAction = await db('user_comment_actions')
    .where({ user_id: loggedInUser, comment_id: commentID })
    .first();

  if (!commentAction) {
    const newRow = await db('user_comment_actions').insert({
      user_id: loggedInUser,
      comment_id: commentID,
      is_downvoted: 1,
    });

    const incrementDownVoteCount = await db('comments')
      .where({ id: commentID })
      .increment('total_downvotes', 1);

    res.status(200).json({
      success: true,
      data: {
        toggle: false,
        message: 'Comment down-voted successfully',
      },
    });
  }

  if (!commentAction.is_downvoted && commentAction.is_upvoted) {
    await db('user_comment_actions')
      .where({ user_id: loggedInUser, comment_id: commentID })
      .update({ is_downvoted: 1, is_upvoted: 0 });

    await db('comments')
      .where({ id: commentID })
      .increment({ total_downvotes: 1, total_upvotes: -1 });

    res.status(200).json({
      success: true,
      data: {
        toggle: true,
        message: 'Comment down-voted successfully',
      },
    });
  }

  if (!commentAction.is_upvoted && !commentAction.is_downvoted) {
    await db('user_comment_actions')
      .where({
        user_id: loggedInUser,
        comment_id: commentID,
      })
      .update({
        is_downvoted: 1,
      });

    await db('comments')
      .where({ id: commentID })
      .increment({ total_downvotes: 1 });

    return res.status(200).json({
      success: true,
      data: {
        toggle: false,
        message: 'Comment down-voted successfully',
      },
    });
  }

  res.status(401).json({
    success: false,
    message: 'This comment is already down-voted by you',
  });
});

module.exports = {
  createTheadComment,
  createCommentReply,
  upVoteComment,
  downVoteComment,
};
