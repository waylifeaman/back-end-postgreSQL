const multer = require('multer');
const ClientError = require('../exceptions/ClientError');



// error untuk handel  kesalahan user 
const errorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'failed',
      message: err.message,
    });
  }
  
  if(err instanceof multer.MulterError) {
    return res.status(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({
      status: 'failed',
      message: err.code === 'LIMIT_FILE_SIZE' ? 'Ukuran file melebihi 5MB' : err.message,
    });
  }
  if(err.message === 'INVALID_MIME') {
    return res.status(400).json({ 
      status: 'failed',
      message: 'Format file harus pdf',

    })
  }

  // Error murni dari JavaScript/library lain yang tidak terduga (bug server)
  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kegagalan pada server kami',
  });
};

module.exports = errorHandler;