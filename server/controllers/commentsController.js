const db = require('../db');
const catchAsync = require('../utils/catchAsync');
const helper = require('../utils/helpers');

const createTheadComment = catchAsync(async (req, res) => {
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

module.exports = {
  createTheadComment,
  createCommentReply,
};
