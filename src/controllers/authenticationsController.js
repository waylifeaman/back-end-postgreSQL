const UsersService = require('../services/UsersService');
const AuthenticationsService = require('../services/AuthenticationsService');
const TokenManager = require('../tokenize/TokenManager');

// POST /authentications (login)
const postAuthenticationHandler = async (req, res) => {
  const { email, password } = req.body;

  const id = await UsersService.verifyUserCredential(email, password);

  const accessToken = TokenManager.generateAccessToken({ id });
  const refreshToken = TokenManager.generateRefreshToken({ id });

  await AuthenticationsService.addRefreshToken(refreshToken);

  res.status(200).json({
    status: 'success',
    data: {
      accessToken,
      refreshToken,
    },
  });
};

// PUT /authentications (refresh access token)
const putAuthenticationHandler = async (req, res) => {
  const { refreshToken } = req.body;

  await AuthenticationsService.verifyRefreshToken(refreshToken);
  const { id } = TokenManager.verifyRefreshToken(refreshToken);

  const accessToken = TokenManager.generateAccessToken({ id });

  res.status(200).json({
    status: 'success',
    message: 'Access token berhasil diperbarui',
    data: { accessToken },
  });
};

// DELETE /authentications (logout)
const deleteAuthenticationHandler = async (req, res) => {
  const { refreshToken } = req.body;

  await AuthenticationsService.verifyRefreshToken(refreshToken);
  await AuthenticationsService.deleteRefreshToken(refreshToken);

  res.status(200).json({
    status: 'success',
    message: 'Refresh token berhasil dihapus',
  });
};

module.exports = {
  postAuthenticationHandler,
  putAuthenticationHandler,
  deleteAuthenticationHandler,
};