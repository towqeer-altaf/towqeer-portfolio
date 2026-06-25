const Profile = require('../models/Profile');

// @desc    Get dynamic profile data (skills, experience, services)
// @route   GET /api/profile
// @access  Public
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne().sort({ updatedAt: -1 });
    if (!profile) return res.status(404).json({ message: 'No profile data initialized.' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Upsert profile information
// @route   POST /api/profile
// @access  Private/Admin
exports.upsertProfile = async (req, res) => {
  try {
    const { skills, languages, experience, services } = req.body;
    let profile = await Profile.findOne();

    if (profile) {
      profile.skills = skills || profile.skills;
      profile.languages = languages || profile.languages;
      profile.experience = experience || profile.experience;
      profile.services = services || profile.services;
      const updatedProfile = await profile.save();
      return res.json(updatedProfile);
    }

    const newProfile = new Profile({ skills, languages, experience, services });
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};