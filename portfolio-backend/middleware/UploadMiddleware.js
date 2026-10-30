const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const uploadDir = path.join(__dirname, '..', 'uploads');
const publicUploadDir = path.join(uploadDir, 'public');
const privateUploadDir = path.join(uploadDir, 'private');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const destination = file.fieldname === 'document' ? privateUploadDir : publicUploadDir;
    fs.mkdir(destination, { recursive: true }, (error) => cb(error, destination));
  },
  filename(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = new Map([
    ['.jpeg', ['image/jpeg']],
    ['.jpg', ['image/jpeg']],
    ['.png', ['image/png']],
    ['.pdf', ['application/pdf']]
  ]);
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.get(ext)?.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Upload a JPEG, PNG, or PDF file.');
    error.status = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 2 }
});

module.exports = upload;