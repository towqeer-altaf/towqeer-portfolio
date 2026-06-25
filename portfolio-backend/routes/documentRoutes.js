const express = require('express');
const router = express.Router();
const { getDocuments, uploadDocument, deleteDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All document management operations are protected
router.get('/', protect, getDocuments);
router.post('/', protect, upload.single('document'), uploadDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;