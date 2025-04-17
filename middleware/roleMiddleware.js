const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes (only accessible by logged-in users)
const protect = async (req, res, next) => {
  let token;

  // Check for the Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token and get user from it
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

// Middleware for role-based authorization
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `User role '${req.user.role}' is not authorized for this action`
      );
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
