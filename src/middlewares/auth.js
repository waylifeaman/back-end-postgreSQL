const jwt = require('jsonwebtoken');
const AuthenticationError = require('../exceptions/AuthenticationError');

// Middleware ini memvalidasi header "Authorization: Bearer <access_token>"
// dan menyisipkan payload user ({ id }) ke req.user bila valid.
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Anda belum melampirkan access token'));
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
    req.user = { id: decoded.id };
    return next();
  } catch (error) {
    return next(new AuthenticationError('Access token tidak valid atau kedaluwarsa'));
  }
};

module.exports = auth;