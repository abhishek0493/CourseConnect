const db = require('../db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await db.select().from('users');
  if (!users) {
    return next(new AppError('No Users found', 404));
  }
  res.status(200).json({
    data: users,
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  res.status(200).json({
    data: name,
  });
});

module.exports = {
  getAllUsers,
  createUser,
};
