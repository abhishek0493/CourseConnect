const bcrypt = require('bcrypt');
const db = require('../db');
const { userCreationSchema } = require('../utils/validation');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const userTypes = require('../utils/constants');

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await db.select().from('users');
  if (!users) {
    return next(new AppError('No Users found', 404));
  }
  res.status(200).json({
    data: users,
  });
});

module.exports = {
  getAllUsers,
};
