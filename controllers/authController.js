const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');

const isProd = process.env.NODE_ENV === 'production';

const createSendToken = (user, token, statusCode, req, res) => {
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: isProd || req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'lax',
  });

  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    token,
    data: { user },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const { user, token } = await authService.signup(req.body);
  createSendToken(user, token, 201, req, res);
});

exports.login = catchAsync(async (req, res) => {
  const { user, token } = await authService.login(req.body.email, req.body.password);
  createSendToken(user, token, 201, req, res);
});

exports.isLoggedIn = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: isProd || req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'lax',
  });
  res.status(200).json({ success: true });
};
