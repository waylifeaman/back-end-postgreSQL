const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const { LoginPayloadSchema, RefreshTokenPayloadSchema } = require('../validators/authValidator');
const {
  postAuthenticationHandler,
  putAuthenticationHandler,
  deleteAuthenticationHandler,
} = require('../controllers/authenticationsController');

const router = express.Router();

// PUBLIC
router.post('/', validate(LoginPayloadSchema), asyncHandler(postAuthenticationHandler));
router.put('/', validate(RefreshTokenPayloadSchema), asyncHandler(putAuthenticationHandler));

// PROTECTED (logout)
router.delete('/', auth, validate(RefreshTokenPayloadSchema), asyncHandler(deleteAuthenticationHandler));

module.exports = router;