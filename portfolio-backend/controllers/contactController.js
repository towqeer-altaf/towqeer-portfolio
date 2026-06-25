const Contact = require('../models/Contact');

// @desc    Process incoming contact forms
// @route   POST /api/contact
// @access  Public
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};