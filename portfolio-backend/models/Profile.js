const mongoose = require('mongoose');

const JobExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., "Jan 2024 - Present"
  responsibilities: [{ type: String }]
});

const ProfileSchema = new mongoose.Schema({
  skills: [{ type: String, required: true }],
  languages: [{ type: String }],
  experience: [JobExperienceSchema],
  services: [{
    title: { type: String, required: true },
    description: { type: String, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);