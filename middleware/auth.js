const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: 'Access denied. No token provided!' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.decoded = decoded;
    next();
  } catch (err) {
    res.status(400).send('Invalid data');
  }
};

module.exports = {
  auth,
};
