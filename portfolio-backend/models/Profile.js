const mongoose = require('mongoose');

const JobExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., "Jan 2024 - Present"
  responsibilities: [{ type: String }]
});

const ProfileSchema = new mongoose.Schema({
  name: { type: String, default: 'Towqeer Altaf', trim: true },
  title: { type: String, default: 'ServiceNow Specialist & Software Engineer', trim: true },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  profileImageUrl: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  socialLinks: [{
    label: { type: String, trim: true },
    url: { type: String, trim: true }
  }],
  skills: [{ type: String, trim: true }],
  languages: [{ type: String }],
  experience: [JobExperienceSchema],
  education: [{
    institution: { type: String, trim: true },
    degree: { type: String, trim: true },
    period: { type: String, trim: true },
    details: { type: String, trim: true }
  }],
  services: [{
    title: { type: String, trim: true },
    description: { type: String, trim: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);