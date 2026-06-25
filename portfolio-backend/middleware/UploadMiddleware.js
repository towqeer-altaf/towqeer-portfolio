const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dynamically target the absolute root of your backend project
const uploadDir = path.resolve(process.cwd(), 'uploads');

// FORCE CLEANUP PIPELINE: Destroys any file blockages and guarantees a clean directory
try {
  if (fs.existsSync(uploadDir)) {
    const stat = fs.lstatSync(uploadDir);
    if (!stat.isDirectory()) {
      console.log('⚠️ Found a flat file named "uploads". Deleting to replace with folder...');
      fs.unlinkSync(uploadDir); // Deletes the file if it's blocking the folder
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } else {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  console.log(`✅ Upload system tracking absolute directory: ${uploadDir}`);
} catch (err) {
  console.error('❌ Failed to verify upload directory structure:', err.message);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Sanitize filename to strip spaces or weird characters just in case
    const sanitizedName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${sanitizedName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpeg', '.jpg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;