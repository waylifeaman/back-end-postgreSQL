const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const auth = require('../middlewares/auth');
const {
  getProfileHandler,
  getMyApplicationsHandler,
  getMyBookmarksHandler,
} = require('../controllers/profileController');

const router = express.Router();

// Semua route profile PROTECTED
router.use(auth);

router.get('/', asyncHandler(getProfileHandler));
router.get('/applications', asyncHandler(getMyApplicationsHandler));
router.get('/bookmarks', asyncHandler(getMyBookmarksHandler));

module.exports = router;