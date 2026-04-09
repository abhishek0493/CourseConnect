const commentRepository = require('../repositories/commentRepository');
const AppError = require('../utils/appError');
const { commentCreationSchema } = require('../utils/validation');

const createComment = async (threadId, userId, comment) => {
  const { error } = commentCreationSchema.validate({ comment });
  if (error) throw new AppError(error.details[0].message, 400);

  const thread = await commentRepository.findThreadById(threadId);
  if (!thread) throw new AppError('Thread not found', 404);

  const id = await commentRepository.createComment({
    thread_id: thread.id,
    user_id: userId,
    comment,
  });
  return id;
};

const createReply = async (threadId, parentCommentId, userId, comment) => {
  const thread = await commentRepository.findThreadById(threadId);
  if (!thread) throw new AppError('Thread not found', 404);

  const id = await commentRepository.createComment({
    thread_id: thread.id,
    parent_comment_id: parentCommentId,
    user_id: userId,
    comment,
  });
  return id;
};

const upVoteComment = async (commentId, userId) => {
  const commentAction = await commentRepository.getCommentAction(userId, commentId);

  if (!commentAction) {
    await commentRepository.insertCommentAction({ user_id: userId, comment_id: commentId, is_upvoted: 1 });
    await commentRepository.incrementComment(commentId, { total_upvotes: 1 });
    return { toggle: false, message: 'Comment up-voted successfully' };
  }

  if (!commentAction.is_upvoted && commentAction.is_downvoted) {
    await commentRepository.updateCommentAction(userId, commentId, { is_upvoted: 1, is_downvoted: 0 });
    await commentRepository.incrementComment(commentId, { total_upvotes: 1, total_downvotes: -1 });
    return { toggle: true, message: 'Comment up-voted successfully' };
  }

  if (!commentAction.is_upvoted && !commentAction.is_downvoted) {
    await commentRepository.updateCommentAction(userId, commentId, { is_upvoted: 1 });
    await commentRepository.incrementComment(commentId, { total_upvotes: 1 });
    return { toggle: false, message: 'Comment up-voted successfully' };
  }

  throw new AppError('This comment is already up-voted by you', 401);
};

const downVoteComment = async (commentId, userId) => {
  const commentAction = await commentRepository.getCommentAction(userId, commentId);

  if (!commentAction) {
    await commentRepository.insertCommentAction({ user_id: userId, comment_id: commentId, is_downvoted: 1 });
    await commentRepository.incrementComment(commentId, { total_downvotes: 1 });
    return { toggle: false, message: 'Comment down-voted successfully' };
  }

  if (!commentAction.is_downvoted && commentAction.is_upvoted) {
    await commentRepository.updateCommentAction(userId, commentId, { is_downvoted: 1, is_upvoted: 0 });
    await commentRepository.incrementComment(commentId, { total_downvotes: 1, total_upvotes: -1 });
    return { toggle: true, message: 'Comment down-voted successfully' };
  }

  if (!commentAction.is_upvoted && !commentAction.is_downvoted) {
    await commentRepository.updateCommentAction(userId, commentId, { is_downvoted: 1 });
    await commentRepository.incrementComment(commentId, { total_downvotes: 1 });
    return { toggle: false, message: 'Comment down-voted successfully' };
  }

  throw new AppError('This comment is already down-voted by you', 401);
};

module.exports = {
  createComment,
  createReply,
  upVoteComment,
  downVoteComment,
};
