const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const { CategoryPayloadSchema, CategoryUpdatePayloadSchema } = require('../validators/categoryValidator');
const {
  postCategoryHandler,
  getCategoriesHandler,
  getCategoryByIdHandler,
  putCategoryByIdHandler,
  deleteCategoryByIdHandler,
} = require('../controllers/categoriesController');

const router = express.Router();

// PUBLIC
router.get('/', asyncHandler(getCategoriesHandler));
router.get('/:id', asyncHandler(getCategoryByIdHandler));

// PROTECTED
router.post('/', auth, validate(CategoryPayloadSchema), asyncHandler(postCategoryHandler));
router.put('/:id', auth, validate(CategoryUpdatePayloadSchema), asyncHandler(putCategoryByIdHandler));
router.delete('/:id', auth, asyncHandler(deleteCategoryByIdHandler));

module.exports = router;