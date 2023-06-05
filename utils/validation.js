const Joi = require('joi');

const userCreationSchema = Joi.object({
  name: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .label('confirmPassword')
    .messages({
      'any.only': 'Confirm password does not match the password',
    }),
  user_type: Joi.number().min(1).required(),
  type_value: Joi.string(),
});

module.exports = { userCreationSchema };
