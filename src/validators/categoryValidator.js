const Joi = require('joi');

const CategoryPayloadSchema = Joi.object({
  name: Joi.string().max(100).required(),
});
// validator untuk edit field opsional 
const CategoryUpdatePayloadSchema = Joi.object({
  name: Joi.string().max(100)
}).min(1);


module.exports = { CategoryPayloadSchema, CategoryUpdatePayloadSchema };