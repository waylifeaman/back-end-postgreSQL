const CompaniesService = require('../services/CompaniesService');
const cache = require('../utils/cache');

const keys = {
  detail: (id) => `company:${id}`,
  list: () => 'companies',
}
const postCompanyHandler = async (req, res) => {
  const { name, description, location } = req.body;
    const owner_id = req.user.id;
    console.log('owner_id dari token:', req.user.id); //sementara

    const companyId = await CompaniesService.addCompany({
    name, description, location, owner_id,
  });

  //invalidasi cache list
  await cache.del(keys.list(), keys.detail(companyId));

  res.status(201).json({
    status: 'success',
    message: 'Company berhasil ditambahkan',
    data: { id: companyId },
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
  const {id} = req.params;
  const cached = await cache.get(keys.detail(id));

  if(cached){
    res.set('X-Data-Source', 'cache');
    return res.status(200).json({
      status: 'success',
      data: cached,
    });
  }
  const company = await CompaniesService.getCompaniesById(id);
  await cache.set(keys.detail(id), company);
  res.set('X-Data-Source', 'database');
  res.status(200).json({
    status: 'success',
    data: company,
  });
};

const putCompanyByIdHandler = async (req, res) => {
  const { id } = req.params;
  await CompaniesService.verifyCompanyOwner(id, req.user.id);
  await CompaniesService.editCompaniesById(id, req.body);
  
  //invalidasi cache
  await cache.del(keys.detail(id), keys.list());
  res.status(200).json({
    status: 'success',
    message: 'Company berhasil diperbarui',
  });
};

const deleteCompanyByIdHandler = async (req, res) => {
  const { id } = req.params;

  await CompaniesService.verifyCompanyOwner(id, req.user.id);
  await CompaniesService.deleteCompanyById(id);
  await cache.del(keys.detail(id), keys.list());
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