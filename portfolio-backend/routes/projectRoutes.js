const express = require('express');
const router = express.Router();
const { getProjects, createProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public Pipeline
router.get('/', getProjects);

// Protected Pipeline (Admin Auth + Image Upload)
router.post('/', protect, upload.single('image'), createProject);

module.exports = router;