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

const createUser = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const result = await userCreationSchema.validateAsync(req.body);
  console.log(result.error);
  const { name, email, password, type } = req.body;

  return 1;

  // Generate a salt
  const salt = await bcrypt.genSalt(10);

  // Hash the password with the generated salt
  const hashedPassword = await bcrypt.hash(password, salt);

  // Save the user to the database with the hashed password
  const user = await db('users').insert({
    name: name,
    email: email,
    password: hashedPassword,
    type: 1,
    type_value: userTypes.userTypes[1],
  });

  res.status(201).json({ message: 'User created successfully', user });
});

const createUserTest = catchAsync(async (req, res, next) => {
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
