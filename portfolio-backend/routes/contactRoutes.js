const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactController');

// Public form submission pipeline
router.post('/', submitContactForm);

module.exports = router;