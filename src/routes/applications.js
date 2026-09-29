const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const {
  ApplicationPayloadSchema,
  ApplicationStatusPayloadSchema,
} = require('../validators/applicationValidator');
const {
  postApplicationHandler,
  getApplicationsHandler,
  getApplicationByIdHandler,
  getApplicationsByUserIdHandler,
  getApplicationsByJobIdHandler,
  putApplicationByIdHandler,
  deleteApplicationByIdHandler,
} = require('../controllers/applicationsController');

const router = express.Router();

// Semua route applications PROTECTED
router.use(auth);

router.post('/', validate(ApplicationPayloadSchema), asyncHandler(postApplicationHandler));
router.get('/', asyncHandler(getApplicationsHandler));
router.get('/user/:userId', asyncHandler(getApplicationsByUserIdHandler));
router.get('/job/:jobId', asyncHandler(getApplicationsByJobIdHandler));
router.get('/:id', asyncHandler(getApplicationByIdHandler));
router.put('/:id', validate(ApplicationStatusPayloadSchema), asyncHandler(putApplicationByIdHandler));
router.delete('/:id', asyncHandler(deleteApplicationByIdHandler));

module.exports = router;