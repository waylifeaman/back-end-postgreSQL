const jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');

const ACCESS_TOKEN_AGE = process.env.ACCESS_TOKEN_AGE || '10800'; 

const TokenManager = {
  generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: Number(ACCESS_TOKEN_AGE),
  }),

  generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),

  verifyRefreshToken: (refreshToken) => {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      return decoded;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;