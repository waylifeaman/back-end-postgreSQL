const Joi = require('joi');

const ApplicationPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  status: Joi.string().optional(),
  // coverLetter: Joi.string().allow('', null),
});

const ApplicationStatusPayloadSchema = Joi.object({
  status: Joi.string().valid('pending', 'reviewed', 'accepted', 'rejected').required(),
});

module.exports = { ApplicationPayloadSchema, ApplicationStatusPayloadSchema };