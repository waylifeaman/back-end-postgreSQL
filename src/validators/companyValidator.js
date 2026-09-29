const Joi = require('joi');

const CompanyPayloadSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().allow('', null),
  location: Joi.string().max(100).required(),
});

module.exports = { CompanyPayloadSchema };