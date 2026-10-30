const express = require('express');
const {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate
} = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/UploadMiddleware');

const router = express.Router();

router.get('/', getCertificates);
router.post('/', protect, upload.single('file'), createCertificate);
router.put('/:id', protect, upload.single('file'), updateCertificate);
router.delete('/:id', protect, deleteCertificate);

module.exports = router;
