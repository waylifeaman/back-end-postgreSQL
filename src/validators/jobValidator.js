const Joi = require('joi');

const JobPayloadSchema = Joi.object({
  title: Joi.string().max(150).required(),
  description: Joi.string().required(),
  company_id: Joi.string().required(),
  category_id: Joi.string().required(),
  job_type: Joi.string().max(50).allow('', null),
  experience_level: Joi.string().max(50).allow('', null),
  location_type: Joi.string().max(50).allow('', null),
  location_city: Joi.string().max(100).allow('', null),
  salary_min: Joi.number().integer().min(0).allow(null),
  salary_max: Joi.number().integer().min(0).allow(null),
  is_salary_visible: Joi.boolean(),
  status: Joi.string().max(20).allow('', null),
});

// validator untuk edit field opsional 
  const JobUpdatePayloadSchema = Joi.object({
  title: Joi.string().max(150),
  description: Joi.string(),
  company_id: Joi.string(),
  category_id: Joi.string(),
  job_type: Joi.string().max(50).allow('', null),
  experience_level: Joi.string().max(50).allow('', null),
  location_type: Joi.string().max(50).allow('', null),
  location_city: Joi.string().max(100).allow('', null),
  salary_min: Joi.number().integer().min(0).allow(null),
  salary_max: Joi.number().integer().min(0).allow(null),
  is_salary_visible: Joi.boolean(),
  status: Joi.string().max(20).allow('', null),
}).min(1);

module.exports = { JobPayloadSchema, JobUpdatePayloadSchema };