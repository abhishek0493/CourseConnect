const commentService = require('../services/commentService');
const catchAsync = require('../utils/catchAsync');

const createTheadComment = catchAsync(async (req, res) => {
  const id = await commentService.createComment(
    req.params.thread_id,
    req.user.id,
    req.body.comment
  );
  res.status(200).json({ success: true, data: id });
});

const createCommentReply = catchAsync(async (req, res) => {
  const id = await commentService.createReply(
    req.params.thread_id,
    req.params.comment_id,
    req.user.id,
    req.body.comment
  );
  res.status(200).json({ success: true, data: id });
});

const upVoteComment = catchAsync(async (req, res) => {
  const data = await commentService.upVoteComment(req.params.id, req.user.id);
  res.status(200).json({ success: true, data });
});

const downVoteComment = catchAsync(async (req, res) => {
  const data = await commentService.downVoteComment(req.params.id, req.user.id);
  res.status(200).json({ success: true, data });
});

module.exports = {
  createTheadComment,
  createCommentReply,
  upVoteComment,
  downVoteComment,
};
