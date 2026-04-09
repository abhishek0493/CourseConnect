const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');
const userRepository = require('../repositories/userRepository');

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
  const currentUser = await userRepository.findByUuid(decoded.id);

  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: 'User not found',
    });
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

module.exports = {
  protect,
};
