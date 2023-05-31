const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const db = require('../db');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await db('users').insert({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  // console.log(url);
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, req, res);
});
