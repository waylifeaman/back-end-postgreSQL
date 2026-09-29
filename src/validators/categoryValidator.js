const Joi = require('joi');

const CategoryPayloadSchema = Joi.object({
  name: Joi.string().max(100).required(),
});

module.exports = { CategoryPayloadSchema };