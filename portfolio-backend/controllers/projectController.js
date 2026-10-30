const Project = require('../models/Project');
const fs = require('fs/promises');
const path = require('path');

const parseTechStack = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    return value.split(',');
  }
  return value.split(',');
};

const removeProjectImage = async (imageUrl) => {
  if (!imageUrl?.startsWith('/uploads/')) return;
  const filename = path.basename(imageUrl);
  const directory = imageUrl.includes('/private/') ? 'private' : imageUrl.includes('/public/') ? 'public' : '';
  const filePath = path.join(__dirname, '..', 'uploads', directory, filename);
  await fs.unlink(filePath).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
};

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
    const imageUrl = req.file ? `/uploads/public/${req.file.filename}` : '';

    const newProject = new Project({
      title,
      description,
      liveLink,
      githubLink,
      techStack: parseTechStack(techStack),
      imageUrl,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    const { title, description, liveLink, githubLink, techStack } = req.body;
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (liveLink !== undefined) project.liveLink = liveLink;
    if (githubLink !== undefined) project.githubLink = githubLink;
    if (techStack !== undefined) project.techStack = parseTechStack(techStack);

    const previousImage = project.imageUrl;
    if (req.file) project.imageUrl = `/uploads/public/${req.file.filename}`;
    const updatedProject = await project.save();

    if (req.file && previousImage) await removeProjectImage(previousImage);
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    await project.deleteOne();
    await removeProjectImage(project.imageUrl);
    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};