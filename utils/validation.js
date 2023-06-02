const Joi = require('joi');

const userCreationSchema = Joi.object({
  name: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  type: Joi.number().min(1).required(),
  type_value: Joi.string(),
});

module.exports = { userCreationSchema };
