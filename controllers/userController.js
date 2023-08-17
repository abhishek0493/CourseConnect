const db = require('../db');
const _ = require('lodash');
const { userTypes } = require('../utils/constants');
const catchAsync = require('../utils/catchAsync');

const getUserTypes = catchAsync(async (req, res, next) => {
  const types = await userTypes.user;
  res.status(200).json({
    success: true,
    data: types,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await db.select().from('users');
  if (!users) {
    return res.status(400).json({ success: false, message: 'No users found' });
  }
  res.status(200).json({
    success: true,
    data: users,
  });
});

const getAllCommunityJoinRequests = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const communityName = req.query.name;

  let requestsQuery = db('user_communities as uc')
    .select('uc.*', 'u.name as request_user', 'c.name', 'c.access_type')
    .join('communities as c', 'c.id', '=', 'uc.community_id')
    .join('users as u', 'u.id', '=', 'uc.user_id')
    .where('c.created_by', loggedInUser)
    .andWhere('c.access_type', '!=', 1)
    .andWhere('uc.status', '!=', 1);

  if (communityName && (communityName != null || commuinityName != undefined)) {
    requestsQuery = requestsQuery.andWhere('c.name', communityName);
  }

  const requests = await requestsQuery;

  res.status(200).json({
    success: true,
    data: requests,
  });
});

const approveRequest = catchAsync(async (req, res) => {
  const request_id = req.params.id;
  const request = await db('user_communities')
    .where({ id: request_id })
    .first();

  if (!request) {
    res.status(400).json({
      success: false,
      message: 'Request not found',
    });
  }

  if (request && request.status == 1) {
    res.status(401).json({
      success: false,
      message: 'This request is already approved',
    });
  }

  const approve = await db('user_communities')
    .where('id', request_id)
    .update({ status: 1 });

  res.status(200).json({
    success: true,
    data: {
      id: approve,
      message: 'Request approved !!',
    },
  });
});

const rejectRequest = catchAsync(async (req, res) => {
  const request_id = req.params.id;
  const request = await db('user_communities')
    .where({ id: request_id })
    .first();

  if (!request) {
    res.status(400).json({
      success: false,
      message: 'Request not found',
    });
  }

  if (request && request.status == 1) {
    res.status(401).json({
      success: false,
      message: 'This request is already approved',
    });
  }

  const reject = await db('user_communities')
    .where('id', request_id)
    .update({ status: 2 });

  res.status(200).json({
    success: true,
    data: {
      id: reject,
      message: 'Request rejected !!',
    },
  });
});

const getUserStats = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;

  const stats = await db('users as u')
    .select(
      'u.name',
      db.raw(
        `(SELECT COUNT(*) FROM user_communities as uc WHERE uc.status = 1 AND uc.is_author != 1 AND uc.user_id = ${loggedInUser}) as total_communities_joined`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM communities as c WHERE c.created_by = ${loggedInUser}) as total_communities_created`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM threads as c WHERE c.user_id = ${loggedInUser}) as total_threads_created`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM comments as cmt WHERE cmt.user_id = ${loggedInUser} AND parent_comment_id = 0) as total_comments`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM comments as cmt WHERE cmt.user_id = ${loggedInUser} AND parent_comment_id != 0) as total_replies`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM user_communities as ucr WHERE ucr.community_id IN (SELECT c.id FROM communities as c WHERE c.created_by = ${loggedInUser} AND c.access_type != 1) AND ucr.is_author != 1 AND ucr.status = 0) as total_requests`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM user_thread_actions as uta WHERE uta.thread_id IN (SELECT t.id FROM threads as t WHERE t.user_id = ${loggedInUser}) AND uta.is_upvoted = 1 AND uta.user_id != ${loggedInUser}) as total_upvotes`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM user_thread_actions as uta WHERE uta.thread_id IN (SELECT t.id FROM threads as t WHERE t.user_id = ${loggedInUser}) AND uta.is_downvoted = 1 AND uta.user_id != ${loggedInUser}) as total_downvotes`
      ),
      db.raw(
        `(SELECT COUNT(*) FROM user_thread_actions as uta WHERE uta.user_id = ${loggedInUser} AND uta.is_saved = 1) as total_saved`
      )
    )
    .where({ id: loggedInUser });

  res.status(200).json({
    success: true,
    data: stats,
  });
});

module.exports = {
  getAllUsers,
  getUserTypes,
  getAllCommunityJoinRequests,
  approveRequest,
  rejectRequest,
  getUserStats,
};
