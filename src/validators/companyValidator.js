const Joi = require('joi');

const CompanyPayloadSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().allow('', null),
  location: Joi.string().max(100).required(),
});
// validator untuk edit field opsional 
const CompanyUpdatePayloadSchema = Joi.object({
  name: Joi.string().max(100),
  description: Joi.string().max(500),
  location: Joi.string().max(100),
}).min(1);

module.exports = { CompanyPayloadSchema, CompanyUpdatePayloadSchema };