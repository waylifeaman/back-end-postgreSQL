const UsersService = require('../services/UsersService');
const cache = require('../utils/cache');

const postUserHandler = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userId = await UsersService.addUser({ name, email, password, role });

  res.status(201).json({
    status: 'success',
    message: 'User berhasil ditambahkan',
    data: { id:userId },
  });
};

const getUserByIdHandler = async (req, res) => {
  const {id} = req.params;
  const cached = await cache.get(`user:${id}`);
  if (cached) {
    res.set('X-Data-Source', 'cache');
    return res.status(200).json({
      status: 'success',
      data: cached,
    });
  }
  
  const user = await UsersService.getUserById(id);
  await cache.set(`user:${id}`, user);

  res.set('X-Data-Source', 'database');
  return res.status(200).json({
    status: 'success',
    data:  user ,
  });
};

module.exports = { postUserHandler, getUserByIdHandler };