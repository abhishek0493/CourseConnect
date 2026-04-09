const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const uuid = require('uuid');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/appError');
const {
  userCreationSchema,
  login: loginSchema,
  verifyPassword,
} = require('../utils/validation');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.uuid, name: user.name },
    process.env.JWT_SECRET_KEY,
  );
};

const signup = async (body) => {
  const { error } = userCreationSchema.validate(body);
  if (error) throw new AppError(error.details[0].message, 400);

  const existing = await userRepository.findByEmail(body.email);
  if (existing)
    throw new AppError('User Already Exists. Please try logging in', 403);

  const user_uuid = uuid.v4();
  const userObj = _.pick(body, [
    'name',
    'email',
    'type',
    'type_value',
    'consent',
  ]);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(body.password, salt);

  const id = await userRepository.create({
    uuid: user_uuid,
    name: userObj.name,
    email: userObj.email,
    password: hashedPassword,
    type: userObj.type,
    type_value: userObj.type_value,
    consent: userObj.consent,
  });

  const retrievedUuid = await userRepository.getUuidById(id);
  userObj.uuid = retrievedUuid;

  const token = generateToken(userObj);
  return { user: userObj, token };
};

const login = async (email, password) => {
  const { error } = loginSchema.validate({ email, password });
  if (error) throw new AppError(error.details[0].message, 400);

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError(
      'No user found with this email. Please check the email id or create a new account',
      400,
    );
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    throw new AppError(
      'Invalid password. Please check your password and try again',
      401,
    );
  }

  const transform = _.pick(user, ['name', 'uuid', 'type']);
  const token = generateToken(transform);
  return { user: transform, token };
};

module.exports = {
  signup,
  login,
  generateToken,
};
