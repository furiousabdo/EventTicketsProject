const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT authentication middleware
exports.authenticate = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store the user data (from token) in the request object
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Check if user is an organizer
exports.isOrganizer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'organizer') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    next();
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
