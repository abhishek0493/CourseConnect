const Joi = require('joi');
const bcrypt = require('bcrypt');

const userCreationSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .label('confirmPassword')
    .messages({
      'any.only': 'Confirm password does not match the password',
    }),
  type: Joi.number().min(1).required(),
  type_value: Joi.string(),
});

const communityCreationSchema = Joi.object({
  name: Joi.string()
    .regex(/^[a-z0-9-]+$/i)
    .min(3)
    .max(20)
    .required(),
  title: Joi.string().required(),
  accessType: Joi.number().required(),
  description: Joi.string().min(5).required(),
  category: Joi.number().required(),
});

const threadCreationSchema = Joi.object({
  community: Joi.number().required(),
  title: Joi.string().required(),
  type: Joi.number().valid(1, 2).required(),
  source: Joi.string().when('type', {
    is: '1',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  pricing: Joi.number().when('type', {
    is: '1',
    then: Joi.number().valid('1', '2').required(),
    otherwise: Joi.number().optional(),
  }),
  link: Joi.string().when('type', {
    is: '1',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  body: Joi.string().optional().allow(''),
  is_completed: Joi.boolean().when('type', {
    is: '1',
    then: Joi.boolean().required(),
    otherwise: Joi.boolean().optional(),
  }),
  rating: Joi.number().when('type', {
    is: '1',
    then: Joi.number(),
    otherwise: Joi.number().optional(),
  }),
});

const commentCreationSchema = Joi.object({
  comment: Joi.string().required(),
});

const verifyPassword = async function (inputPassword, userPassword) {
  return await bcrypt.compare(inputPassword, userPassword);
};

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  userCreationSchema,
  communityCreationSchema,
  threadCreationSchema,
  verifyPassword,
  commentCreationSchema,
  login,
};
