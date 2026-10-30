const Profile = require('../models/Profile');
const fs = require('fs/promises');
const path = require('path');

const profileDefaults = {
  name: 'Towqeer Altaf',
  title: 'ServiceNow Specialist & Software Engineer',
  bio: '',
  location: '',
  email: '',
  phone: '',
  profileImageUrl: '',
  resumeUrl: '',
  socialLinks: [],
  skills: [],
  languages: [],
  experience: [],
  education: [],
  services: []
};

const parseArray = (value, fieldName) => {
  if (value === undefined) return undefined;
  const parsed = typeof value === 'string' ? JSON.parse(value) : value;
  if (!Array.isArray(parsed)) throw new Error(`${fieldName} must be a list.`);
  return parsed;
};

const removeUploadedFile = async (fileUrl) => {
  if (!fileUrl?.startsWith('/uploads/')) return;
  const filename = path.basename(fileUrl);
  const directory = fileUrl.includes('/private/') ? 'private' : fileUrl.includes('/public/') ? 'public' : '';
  const filePath = path.join(__dirname, '..', 'uploads', directory, filename);
  await fs.unlink(filePath).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
};

// @desc    Get dynamic profile data (skills, experience, services)
// @route   GET /api/profile
// @access  Public
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne().sort({ updatedAt: -1 });
    res.json(profile || profileDefaults);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Upsert profile information
// @route   POST /api/profile
// @access  Private/Admin
exports.upsertProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne() || new Profile(profileDefaults);
    const fields = ['name', 'title', 'bio', 'location', 'email', 'phone'];
    const listFields = ['socialLinks', 'skills', 'languages', 'experience', 'education', 'services'];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) profile[field] = req.body[field];
    });
    listFields.forEach((field) => {
      const value = parseArray(req.body[field], field);
      if (value !== undefined) profile[field] = value;
    });

    const oldFiles = [];
    if (req.files?.profileImage?.[0]) {
      if (profile.profileImageUrl) oldFiles.push(profile.profileImageUrl);
      profile.profileImageUrl = `/uploads/public/${req.files.profileImage[0].filename}`;
    }
    if (req.files?.resume?.[0]) {
      if (profile.resumeUrl) oldFiles.push(profile.resumeUrl);
      profile.resumeUrl = `/uploads/public/${req.files.resume[0].filename}`;
    }

    const savedProfile = await profile.save();
    await Promise.all(oldFiles.map(removeUploadedFile));
    res.json(savedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};