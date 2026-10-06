const InvariantError = require('../exceptions/InvariantError');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body,{ convert: false });

  if (error) {
    return next(new InvariantError(error.details[0].message));
  }

  return next();
};

module.exports = validate;