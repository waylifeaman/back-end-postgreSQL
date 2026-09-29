const UsersService = require('../services/UsersService');

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
  const user = await UsersService.getUserById(req.params.id);

  res.status(200).json({
    status: 'success',
    data:  user ,
  });
};

module.exports = { postUserHandler, getUserByIdHandler };