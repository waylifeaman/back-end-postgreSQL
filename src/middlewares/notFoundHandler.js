const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: 'failed',
    message: `Resource ${req.originalUrl} tidak ditemukan`,
  });
};

module.exports = notFoundHandler;