const express = require('express');
const router = express.Router();
const { getProfile, upsertProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// Public pipeline for portfolio rendering
router.get('/', getProfile);

// Protected pipeline to update portfolio details
router.post('/', protect, upsertProfile);

module.exports = router;