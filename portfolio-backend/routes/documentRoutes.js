const express = require('express');
const router = express.Router();
const { getDocuments, uploadDocument, deleteDocument, sendDocumentFile } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/UploadMiddleware');

// All document management operations are protected
router.get('/', protect, getDocuments);
router.post('/', protect, upload.single('document'), uploadDocument);
router.delete('/:id', protect, deleteDocument);
router.get('/:id/file', protect, sendDocumentFile);

module.exports = router;