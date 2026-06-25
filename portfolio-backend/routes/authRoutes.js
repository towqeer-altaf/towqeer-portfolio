const express = require('express');
const router = express.Router();
// Inside your routes file, it should look like this:
const { loginAdmin } = require('../controllers/authController');

// Public login endpoint
router.post('/login', loginAdmin);

module.exports = router;