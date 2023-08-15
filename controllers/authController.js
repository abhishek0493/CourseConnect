const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const helpers = require('../utils/helpers');
const {
  userCreationSchema,
  login,
  verifyPassword,
} = require('../utils/validation');
const catchAsync = require('../utils/catchAsync');
const db = require('../db');

const createSendToken = (user, statusCode, req, res) => {
  const token = jwt.sign(
    { id: user.uuid, name: user.name },
    process.env.JWT_SECRET_KEY
  );

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const { error } = userCreationSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });

  const validateExisting = await helpers.checkIfUserExistsByEmail(
    req.body.email
  );

  if (validateExisting.exists) {
    res.status(403).json({
      success: false,
      message: 'User Already Exists. Please try logging in',
    });
  }

  const userObj = _.pick(req.body, [
    'name',
    'email',
    'type',
    'type_value',
    'consent',
  ]);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const [id] = await db('users').insert({
    name: userObj.name,
    email: userObj.email,
    password: hashedPassword,
    type: userObj.type,
    type_value: userObj.type_value,
    consent: userObj.consent,
  });

  await db('users')
    .where({ id: id })
    .select('uuid')
    .then((row) => {
      userObj.uuid = row[0].uuid;
    });

  createSendToken(userObj, 201, req, res);
});

exports.login = catchAsync(async (req, res) => {
  const { error } = login.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });

  const { email, password } = req.body;

  const user = await db('users').where({ email: email }).first();
  if (!user)
    return res.status(400).json({
      succes: false,
      message:
        'No user found with this email. Please check the email id or create a new account',
    });

  const verify = await verifyPassword(password, user.password);
  if (!verify)
    return res.status(401).json({
      succes: false,
      message: 'Invalid password. Please check your password and try again',
    });

  const transform_user = _.pick(user, ['name', 'uuid', 'type']);
  createSendToken(transform_user, 201, req, res);
});

exports.isLoggedIn = catchAsync(async (req, res) => {
  const loggedInUser = req.user;
  res.status(200).json({
    success: true,
    data: loggedInUser,
  });
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 10),
    httpOnly: true,
  });
  res.status(200).json({ success: true });
};
