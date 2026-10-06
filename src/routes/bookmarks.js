const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const auth = require('../middlewares/auth');
const { getBookmarksHandler } = require('../controllers/bookmarksController');

const router = express.Router();

// PROTECTED
router.get('/', auth, asyncHandler(getBookmarksHandler));

module.exports = router;