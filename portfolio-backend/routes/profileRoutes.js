const express = require('express');
const router = express.Router();
const { getProfile, upsertProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/UploadMiddleware');

// Public pipeline for portfolio rendering
router.get('/', getProfile);

// Protected pipeline to update portfolio details
router.put('/', protect, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), upsertProfile);
router.post('/', protect, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), upsertProfile);

module.exports = router;