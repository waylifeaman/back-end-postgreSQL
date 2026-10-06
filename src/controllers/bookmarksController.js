const BookmarksService = require('../services/BookmarksService');
const cache = require('../utils/cache');

const keys ={
  detail: (id) => `bookmark:${id}`,
  byUserId: (userId) => `bookmarks:user:${userId}`,
  byJobId: (jobId) => `bookmarks:job:${jobId}`,
} 
// POST /jobs/:jobId/bookmark
const postBookmarkHandler = async (req, res) => {
  const { jobId } = req.params;
  
  const bookmarkId = await BookmarksService.addBookmarks({
    user_id: req.user.id,
    job_id: jobId,
  });
  //invalidasi cache list
  await cache.del(keys.byUserId(req.user.id), keys.byJobId(jobId));

  res.status(201).json({
    status: 'success',
    message: 'Bookmark berhasil ditambahkan',
    data: { id: bookmarkId },
  });
};
// GET /bookmarks
const getBookmarksHandler = async (req, res) => {
  const {id} = req.params;
  const cached = await cache.get(keys.byUserId(req.user.id));

  if(cached){
    res.set('X-Data-Source', 'cache');
    return res.status(200).json({
      status: 'success',
      data: { bookmarks: cached },
    });
  }
  const bookmarks = await BookmarksService.getBookmarks(req.user.id);
  //invalidasi cache list
  await cache.set(keys.byUserId(req.user.id), bookmarks);
  res.set('X-Data-Source', 'database');
  res.status(200).json({
    status: 'success',
    data: { bookmarks },
  });
};

// GET /jobs/:jobId/bookmark/:id
const getBookmarkDetailHandler = async (req, res) => {
  const { jobId, id } = req.params;   
  const bookmark = await BookmarksService.getBookmarksById(id, jobId, req.user.id);
  return res.status(200).json({
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
  const { jobId } = req.params;
  const userId = req.user.id;

  await BookmarksService.deleteBookmarkByUserAndJob(userId, jobId);

  // invalidasi cache list bookmark milik kandidat
  await cache.del(keys.byUserId(userId));

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