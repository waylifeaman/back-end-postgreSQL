const path = require('path');
const fs = require('fs');
const DocumentsService = require('../services/DocumentsService');
const InvariantError = require('../exceptions/InvariantError');

const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'documents');

const postDocumentHandler = async (req, res) => {
  if (!req.file) {
    throw new InvariantError('File is required and must be a PDF (max 5MB)');
  }

  const documentId = await DocumentsService.addDocument({
    userId: req.user.id,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimeType: req.file.mimetype,
  });

  res.status(201).json({
    status: 'success',
    data: {
      documentId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    },
  });
};

const getDocumentsHandler = async (req, res) => {
  const documents = await DocumentsService.getDocuments();

  res.status(200).json({
    status: 'success',
    data: { documents },
  });
};

const getDocumentByIdHandler = async (req, res) => {
  const document = await DocumentsService.getDocumentById(req.params.id);
  const filePath = path.join(uploadDir, document.filename);

  res.set('Content-Type', 'application/pdf');
  res.set('Content-Disposition', `inline; filename="${document.original_name}"`);

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
};

const deleteDocumentByIdHandler = async (req, res) => {
  await DocumentsService.deleteDocumentById(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Dokumen berhasil dihapus',
  });
};

module.exports = {
  postDocumentHandler,
  getDocumentsHandler,
  getDocumentByIdHandler,
  deleteDocumentByIdHandler,
};