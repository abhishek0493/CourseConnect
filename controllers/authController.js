const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const helpers = require('../utils/helpers');
const { userCreationSchema } = require('../utils/validation');
const catchAsync = require('../utils/catchAsync');
const db = require('../db');

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

  const userObj = _.pick(req.body, ['name', 'email', 'type', 'type_value']);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  await db('users').insert({
    name: userObj.name,
    email: userObj.email,
    password: hashedPassword,
    type: userObj.type,
    type_value: userObj.type_value,
  });

  await db('users')
    .where({ email: userObj.email })
    .select('uuid')
    .then((row) => (userObj.uuid = row[0].uuid));

  const token = jwt.sign(
    { id: userObj.uuid, name: userObj.name },
    process.env.JWT_SECRET_KEY
  );

  res.header('x-auth-token', token).status(200).send({
    name: userObj.name,
    success: true,
    message: 'Account created successfully!',
  });
});
