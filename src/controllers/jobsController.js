const JobsService = require('../services/JobsService');

const postJobHandler = async (req, res) => {
  const id = await JobsService.addJobs({ ...req.body, posted_by: req.user.id });

  res.status(201).json({
    status: 'success',
    message: 'Job berhasil ditambahkan',
    data: { id },
  });
};

// GET /jobs?title=...&company-name=...
const getJobsHandler = async (req, res) => {
  const { title, 'company-name': companyName } = req.query;
  const jobs = await JobsService.getJobs({ title, companyName });

  res.status(200).json({
    status: 'success',
    data: { jobs },
  });
};

const getJobByIdHandler = async (req, res) => {
  const job = await JobsService.getJobsById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: job ,
  });
};

const getJobsByCompanyIdHandler = async (req, res) => {
  const jobs = await JobsService.getJobsByCompanyId(req.params.companyId);

  res.status(200).json({
    status: 'success',
    data: { jobs },
  });
};

const getJobsByCategoryIdHandler = async (req, res) => {
  const jobs = await JobsService.getJobsByCategoryId(req.params.categoryId);

  res.status(200).json({
    status: 'success',
    data: { jobs },
  });
};

const putJobByIdHandler = async (req, res) => {
  const { id } = req.params;

  await JobsService.verifyJobOwner(id, req.user.id);
  await JobsService.editJobsById(id, req.body);

  res.status(200).json({
    status: 'success',
    message: 'Job berhasil diperbarui',
  });
};

const deleteJobByIdHandler = async (req, res) => {
  const { id } = req.params;

  await JobsService.verifyJobOwner(id, req.user.id);
  await JobsService.deleteJobsById(id);

  res.status(200).json({
    status: 'success',
    message: 'Job berhasil dihapus',
  });
};

module.exports = {
  postJobHandler,
  getJobsHandler,
  getJobByIdHandler,
  getJobsByCompanyIdHandler,
  getJobsByCategoryIdHandler,
  putJobByIdHandler,
  deleteJobByIdHandler,
};