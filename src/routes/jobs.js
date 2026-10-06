const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const { JobPayloadSchema, JobUpdatePayloadSchema } = require('../validators/jobValidator');
const {
  postJobHandler,
  getJobsHandler,
  getJobByIdHandler,
  getJobsByCompanyIdHandler,
  getJobsByCategoryIdHandler,
  putJobByIdHandler,
  deleteJobByIdHandler,
} = require('../controllers/jobsController');
const {
  postBookmarkHandler,
  getBookmarkDetailHandler,
  deleteBookmarkHandler,
} = require('../controllers/bookmarksController');

const router = express.Router();

// PUBLIC
router.get('/', asyncHandler(getJobsHandler)); // ?title=...&company-name=...
router.get('/company/:companyId', asyncHandler(getJobsByCompanyIdHandler));
router.get('/category/:categoryId', asyncHandler(getJobsByCategoryIdHandler));
router.get('/:id', asyncHandler(getJobByIdHandler));

// PROTECTED
router.post('/', auth, validate(JobPayloadSchema), asyncHandler(postJobHandler));
router.put('/:id', auth, validate(JobUpdatePayloadSchema), asyncHandler(putJobByIdHandler));
router.delete('/:id', auth, asyncHandler(deleteJobByIdHandler));

// PROTECTED: bookmark (nested di bawah /jobs/:jobId/bookmark)
router.post('/:jobId/bookmark', auth, asyncHandler(postBookmarkHandler));
router.get('/:jobId/bookmark/:id', auth, asyncHandler(getBookmarkDetailHandler));
router.delete('/:jobId/bookmark', auth, asyncHandler(deleteBookmarkHandler));

module.exports = router;