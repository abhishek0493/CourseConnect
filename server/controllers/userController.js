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
  const requests = await db('user_communities as uc')
    .select('uc.*', 'u.name as request_user', 'c.name', 'c.access_type')
    .join('communities as c', 'c.id', '=', 'uc.community_id')
    .join('users as u', 'u.id', '=', 'uc.user_id')
    .where('c.created_by', loggedInUser)
    .andWhere('c.access_type', '!=', 1);

  res.status(200).json({
    success: true,
    data: requests,
  });
});

module.exports = {
  getAllUsers,
  getUserTypes,
  getAllCommunityJoinRequests,
};
