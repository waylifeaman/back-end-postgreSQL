const ClientError = require('../exceptions/ClientError');

// error untuk handel  kesalahan user 
const errorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'failed',
      message: err.message,
    });
  }

  // Error murni dari JavaScript/library lain yang tidak terduga (bug server)
  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kegagalan pada server kami',
  });
};

module.exports = errorHandler;