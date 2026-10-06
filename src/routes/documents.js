const express = require('express');
const auth = require('../middlewares/auth');
const asyncHandler = require('../utils/asyncHandler');
const upload = require('../middlewares/upload');
const {
  postDocumentHandler,
  getDocumentsHandler,
  getDocumentByIdHandler,
  deleteDocumentByIdHandler,
} = require('../controllers/documentsController');

const router = express.Router();

router.post('/', auth, upload.single('document'), asyncHandler(postDocumentHandler));
router.get('/', asyncHandler(getDocumentsHandler));
router.get('/:id', asyncHandler(getDocumentByIdHandler));
router.delete('/:id', auth, asyncHandler(deleteDocumentByIdHandler));

module.exports = router;