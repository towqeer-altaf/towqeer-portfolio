const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/authController');

// Public login endpoint
router.post('/login', loginAdmin);

module.exports = router;