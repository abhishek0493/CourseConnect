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
  name: Joi.string().min(3).required(),
  description: Joi.string().min(5).required(),
  category_id: Joi.number().min(1).required(),
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
  verifyPassword,
  login,
};
