const db = require('../db');
const _ = require('lodash');
const { userTypes } = require('../utils/constants');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getUserTypes = catchAsync(async (req, res, next) => {
  let types = await userTypes.user;
  res.status(200).send(types);
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await db.select().from('users');
  if (!users) {
    return res.status(400).json({ success: false, message: 'No users found' });
  }
  res.status(200).json({
    data: users,
  });
});

module.exports = {
  getAllUsers,
  getUserTypes,
};
