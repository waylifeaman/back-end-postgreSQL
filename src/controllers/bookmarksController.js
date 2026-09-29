const BookmarksService = require('../services/BookmarksService');

// POST /jobs/:jobId/bookmark
const postBookmarkHandler = async (req, res) => {
  const { jobId } = req.params;

  const bookmarkId = await BookmarksService.addBookmarks({
    user_id: req.user.id,
    job_id: jobId,
  });

  res.status(201).json({
    status: 'success',
    message: 'Bookmark berhasil ditambahkan',
    data: { id: bookmarkId },
  });
};
// GET /bookmarks
const getBookmarksHandler = async (req, res) => {
  const bookmarks = await BookmarksService.getBookmarks(req.user.id);

  res.status(200).json({
    status: 'success',
    data: { bookmarks },
  });
};

// GET /jobs/:jobId/bookmark/:id
const getBookmarkDetailHandler = async (req, res) => {
  const { jobId, id } = req.params;
  const bookmark = await BookmarksService.getBookmarksById(id, jobId, req.user.id);

  res.status(200).json({
    status: 'success',
    data: { 
      id: bookmark.id,
      userId: bookmark.user_id, // atau bookmark.userId
      jobId: bookmark.job_id,   // atau bookmark.jobId
      createdAt: bookmark.created_at, },
  });
};

// DELETE /jobs/:jobId/bookmark
const deleteBookmarkHandler = async (req, res) => {
  await BookmarksService.deleteBookmarkByUserAndJob(req.user.id, req.params.jobId);

  res.status(200).json({
    status: 'success',
    message: 'Bookmark berhasil dihapus',
  });
};



module.exports = {
  postBookmarkHandler,
  getBookmarkDetailHandler,
  deleteBookmarkHandler,
  getBookmarksHandler,
};