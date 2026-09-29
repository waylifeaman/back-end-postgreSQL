const ApplicationsService = require('../services/ApplicationsService');

const postApplicationHandler = async (req, res) => {
  const { job_id,status } = req.body;

  const applicationId = await ApplicationsService.addApplication({
    job_id, user_id: req.user.id,status,
  });

  res.status(201).json({
    status: 'success',
    message: 'Lamaran berhasil dikirim',
    data: { id: applicationId },
  });
};

const getApplicationsHandler = async (req, res) => {
  const applications = await ApplicationsService.getApplications();

  res.status(200).json({
    status: 'success',
    data: { applications },
  });
};

const getApplicationByIdHandler = async (req, res) => {
  const application = await ApplicationsService.getApplicationsById(req.params.id);
  res.status(200).json({
    status: 'success',
    data:  application,
  });
};

const getApplicationsByUserIdHandler = async (req, res) => {
  const applications = await ApplicationsService.getApplicationsByUserId(req.params.userId);

  res.status(200).json({
    status: 'success',
    data: { applications },
  });
};

const getApplicationsByJobIdHandler = async (req, res) => {
  const applications = await ApplicationsService.getApplicationsByJobId(req.params.jobId);

  res.status(200).json({
    status: 'success',
    data: { applications },
  });
};

const putApplicationByIdHandler = async (req, res) => {
  await ApplicationsService.editApplicationsById(req.params.id, req.body.status);

  res.status(200).json({
    status: 'success',
    message: 'Status lamaran berhasil diperbarui',
  });
};

const deleteApplicationByIdHandler = async (req, res) => {
  await ApplicationsService.deleteApplicationsById(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Lamaran berhasil dihapus',
  });
};

module.exports = {
  postApplicationHandler,
  getApplicationsHandler,
  getApplicationByIdHandler,
  getApplicationsByUserIdHandler,
  getApplicationsByJobIdHandler,
  putApplicationByIdHandler,
  deleteApplicationByIdHandler,
};