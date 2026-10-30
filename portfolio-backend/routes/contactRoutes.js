const express = require('express');
const router = express.Router();
const { submitContactForm, getContactMessages } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', submitContactForm);
router.get('/', protect, getContactMessages);

module.exports = router;