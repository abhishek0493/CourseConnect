const db = require('../db');

const findThreadById = async (threadId) => {
  return db('threads').where('id', threadId).first();
};

const createComment = async (data) => {
  const [id] = await db('comments').insert(data);
  return id;
};

const getCommentAction = async (userId, commentId) => {
  return db('user_comment_actions')
    .where({ user_id: userId, comment_id: commentId })
    .first();
};

const insertCommentAction = async (data) => {
  return db('user_comment_actions').insert(data);
};

const updateCommentAction = async (userId, commentId, update) => {
  return db('user_comment_actions')
    .where({ user_id: userId, comment_id: commentId })
    .update(update);
};

const incrementComment = async (id, increments) => {
  return db('comments').where({ id }).increment(increments);
};

module.exports = {
  findThreadById,
  createComment,
  getCommentAction,
  insertCommentAction,
  updateCommentAction,
  incrementComment,
};
