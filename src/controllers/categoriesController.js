const CategoriesService = require('../services/CategoriesService');

const postCategoryHandler = async (req, res) => {
  const id = await CategoriesService.addCategory(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Category berhasil ditambahkan',
    data: { id },
  });
};

const getCategoriesHandler = async (req, res) => {
  const categories = await CategoriesService.getCategories();

  res.status(200).json({
    status: 'success',
    data: { categories },
  });
};

const getCategoryByIdHandler = async (req, res) => {
  const category = await CategoriesService.getCategoryById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: category ,
  });
};

const putCategoryByIdHandler = async (req, res) => {
  await CategoriesService.editCategoryById(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    message: 'Category berhasil diperbarui',
  });
};

const deleteCategoryByIdHandler = async (req, res) => {
  await CategoriesService.deleteCategoryById(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Category berhasil dihapus',
  });
};

module.exports = {
  postCategoryHandler,
  getCategoriesHandler,
  getCategoryByIdHandler,
  putCategoryByIdHandler,
  deleteCategoryByIdHandler,
};