const CompaniesService = require('../services/CompaniesService');

const postCompanyHandler = async (req, res) => {
  const { name, description, location } = req.body;
    const owner_id = req.user.id;
    const id = await CompaniesService.addCompany({
    name, description, location, owner_id,
  });

  res.status(201).json({
    status: 'success',
    message: 'Company berhasil ditambahkan',
    data: { id },
  });
};

const getCompaniesHandler = async (req, res) => {
  const companies = await CompaniesService.getCompanies();

  res.status(200).json({
    status: 'success',
    data: { companies },
  });
};

const getCompanyByIdHandler = async (req, res) => {
  const company = await CompaniesService.getCompaniesById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: company ,
  });
};

const putCompanyByIdHandler = async (req, res) => {
  const { id } = req.params;

  await CompaniesService.verifyCompanyOwner(id, req.user.id);
  await CompaniesService.editCompaniesById(id, req.body);

  res.status(200).json({
    status: 'success',
    message: 'Company berhasil diperbarui',
  });
};

const deleteCompanyByIdHandler = async (req, res) => {
  const { id } = req.params;

  await CompaniesService.verifyCompanyOwner(id, req.user.id);
  await CompaniesService.deleteCompanyById(id);

  res.status(200).json({
    status: 'success',
    message: 'Company berhasil dihapus',
  });
};

module.exports = {
  postCompanyHandler,
  getCompaniesHandler,
  getCompanyByIdHandler,
  putCompanyByIdHandler,
  deleteCompanyByIdHandler,
};