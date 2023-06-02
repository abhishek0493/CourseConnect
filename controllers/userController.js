const db = require('../db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
};
