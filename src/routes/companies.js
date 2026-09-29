const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const { CompanyPayloadSchema } = require('../validators/companyValidator');
const {
  postCompanyHandler,
  getCompaniesHandler,
  getCompanyByIdHandler,
  putCompanyByIdHandler,
  deleteCompanyByIdHandler,
} = require('../controllers/companiesController');

const router = express.Router();

// PUBLIC
router.get('/', asyncHandler(getCompaniesHandler));
router.get('/:id', asyncHandler(getCompanyByIdHandler));

// PROTECTED
router.post('/', auth, validate(CompanyPayloadSchema), asyncHandler(postCompanyHandler));
router.put('/:id', auth, validate(CompanyPayloadSchema), asyncHandler(putCompanyByIdHandler));
router.delete('/:id', auth, asyncHandler(deleteCompanyByIdHandler));

module.exports = router;