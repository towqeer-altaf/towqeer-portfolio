const express = require('express');
const router = express.Router();
// Inside your routes file, it should look like this:
const { loginAdmin, getAdminSession } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public login endpoint
router.post('/login', loginAdmin);
router.get('/me', protect, getAdminSession);

module.exports = router;