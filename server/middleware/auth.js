const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');
const db = require('../db');
const helpers = require('../utils/helpers');

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'You are not logged In. Please log in to get access',
    });
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // 3) Check if user still exists
  const currentUser = await db
    .from('users')
    .select('name', 'id', 'uuid', 'type', 'email')
    .where({ uuid: decoded.id });

  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'User not found',
    });
  }

  const refactor = helpers.refactorResponse(currentUser);

  // console.log(currentUser);
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = refactor[0];
  res.locals.user = refactor[0];
  next();
});

module.exports = {
  protect,
};
