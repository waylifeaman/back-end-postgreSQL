const ApplicationsService = require('../services/ApplicationsService');
const cache = require('../utils/cache');
const {publishApplications} = require('../utils/rabbitmq')

const keys = {
  detail: (id) => `application:${id}`,
  byUserId: (userId) => `applications:user:${userId}`,
  byJobId: (jobId) => `applications:job:${jobId}`,
}

const postApplicationHandler = async (req, res) => {
  const { job_id,status } = req.body;
  const userId = req.user.id;

  const applicationId = await ApplicationsService.addApplication({
    job_id, user_id: userId, status,
  });

  //invalidasi cache list
  await cache.del(keys.byUserId(userId), keys.byJobId(job_id));
  try {
    await publishApplications(applicationId);
  }catch (err) {
    console.error('Gagal publish message ke RabbitMQ:', err.message);
  }
  const application = await ApplicationsService.getApplicationsById(applicationId)

  res.status(201).json({
    status: 'success',
    message: 'Lamaran berhasil dikirim',
    data: { 
      id: application.id,
      user_id: application.user_id,
      job_id: application.job_id,
      status: application.status
     },
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
  const {id} = req.params;
  const cached = await cache.get(keys.detail(id));
  if (cached) {
    res.set('X-Data-Source', 'cache');
    return res.status(200).json({
      status: 'success',
      data: cached,
    });
  }

  const application = await ApplicationsService.getApplicationsById(id);
  await cache.set(keys.detail(id), application);
  res.set('X-Data-Source', 'database');
  return res.status(200).json({
    status: 'success',
    data:  application,
  });
};

const getApplicationsByUserIdHandler = async (req, res) => {
  const {userId} = req.params;
  const cached = await cache.get(keys.byUserId(userId));
  if (cached) {
    res.set('X-Data-Source', 'cache');
    return res.status(200).json({
      status: 'success',
      data: { applications: cached },
    });
  }

  const applications = await ApplicationsService.getApplicationsByUserId(userId);
  await cache.set(keys.byUserId(userId), applications);
  res.set('X-Data-Source', 'database');
  return res.status(200).json({
    status: 'success',
    data: { applications },
  });
};

const getApplicationsByJobIdHandler = async (req, res) => {
  const {jobId} = req.params;
  const cached = await cache.get(keys.byJobId(jobId));
  if (cached) {
    res.set('X-Data-Source', 'cache');  
    return res.status(200).json({
      status: 'success',
      data: {applications: cached},
    });
  }

  const applications = await ApplicationsService.getApplicationsByJobId(req.params.jobId);
  await cache.set(keys.byJobId(jobId), applications);
  res.set('X-Data-Source', 'database');
  return res.status(200).json({
    status: 'success',
    data: { applications },
  });
};

//ambil data user_id dan job_id dari lamaran
const getOwnerKeys = async (id) => {
  const application = await ApplicationsService.getApplicationsById(id);
  return{
    userId: application.user_id ?? application.userId,
    jobId: application.job_id ?? application.jobId,
  }
}

const putApplicationByIdHandler = async (req, res) => {
  const {id} = req.params;

  const {userId, jobId} = await getOwnerKeys(id);
  await ApplicationsService.editApplicationsById(id, req.body.status);
  
  await cache.del(keys.detail(id), keys.byUserId(userId), keys.byJobId(jobId));

  res.status(200).json({
    status: 'success',
    message: 'Status lamaran berhasil diperbarui',
  });
};

const deleteApplicationByIdHandler = async (req, res) => {
  const {id} = req.params;
  const {userId, jobId} = await getOwnerKeys(id);

  await ApplicationsService.deleteApplicationsById(id);
  await cache.del(keys.detail(id), keys.byUserId(userId), keys.byJobId(jobId));

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