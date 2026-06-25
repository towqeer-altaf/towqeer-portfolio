const Project = require('../models/Project');

// @desc    Get all portfolio projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new project entry
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
  try {
    const { title, description, liveLink, githubLink, techStack } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newProject = new Project({
      title,
      description,
      liveLink,
      githubLink,
      techStack: Array.isArray(techStack) ? techStack : techStack.split(','),
      imageUrl,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};