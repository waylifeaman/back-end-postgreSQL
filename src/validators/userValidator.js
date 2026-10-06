const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().max(20).optional(),
});

module.exports = { UserPayloadSchema };