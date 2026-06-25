const express = require('express');
const router = express.Router();
const { getProjects, createProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public Pipeline
router.get('/', getProjects);

// Protected Pipeline (Admin Auth + Image Upload)
router.post('/', protect, upload.single('image'), createProject);

// Add this to your projectRoutes.js
router.delete('/:id', async (req, res) => {
  try {
    const Project = require('../models/Project');
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;