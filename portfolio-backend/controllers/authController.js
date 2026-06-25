const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Admin authentication & token generation
// @route   POST /api/auth/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      _id: user._id,
      username: user.username,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};