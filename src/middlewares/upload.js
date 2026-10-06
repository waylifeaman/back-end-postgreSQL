const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'documents');

// pastikan folder uploads ada
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `$${nanoid(16)}${path.extname(file.originalname)}`;
    cb(null, uniqueName)},
});

const fileFilter = (req, file, cb)=>{
  if(file.mimetype !== 'application/pdf'){
    return cb(null, false);
  }
  return cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;