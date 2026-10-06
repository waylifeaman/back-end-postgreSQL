const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { UserPayloadSchema } = require('../validators/userValidator');
const { postUserHandler, getUserByIdHandler } = require('../controllers/usersController');

const router = express.Router();

// PUBLIC
router.post('/', validate(UserPayloadSchema), asyncHandler(postUserHandler));
router.get('/:id', asyncHandler(getUserByIdHandler));

module.exports = router;