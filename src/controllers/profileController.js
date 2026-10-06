const UsersService = require('../services/UsersService');
const ApplicationsService = require('../services/ApplicationsService');
const BookmarksService = require('../services/BookmarksService');

const getProfileHandler = async (req, res) => {
  const user = await UsersService.getUserById(req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at || user.createdAt,
      updatedAt: user.updated_at || user.updatedAt,
    },
  });
};

const getMyApplicationsHandler = async (req, res) => {
  const applications = await ApplicationsService.getProfileApplications(req.user.id);

  res.status(200).json({
    status: 'success',
    data: { applications },
  });
};

const getMyBookmarksHandler = async (req, res) => {
  const bookmarks = await BookmarksService.getBookmarks(req.user.id);

  res.status(200).json({
    status: 'success',
    data: { bookmarks },
  });
};

module.exports = { getProfileHandler, getMyApplicationsHandler, getMyBookmarksHandler };