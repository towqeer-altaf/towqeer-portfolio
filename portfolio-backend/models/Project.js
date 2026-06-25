const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  liveLink: { type: String },
  githubLink: { type: String },
  techStack: [{ type: String, required: true }],
  imageUrl: { type: String, required: true } // Handled by Multer/Cloudinary
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);