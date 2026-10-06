const jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');

// Ambil nilai dari .env, gunakan parseInt agar dipastikan bertipe angka
const ACCESS_TOKEN_AGE = parseInt(process.env.ACCESS_TOKEN_AGE || '10800', 10);

const TokenManager = {
  generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: ACCESS_TOKEN_AGE,
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