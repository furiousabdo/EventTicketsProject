const express = require('express');
const router = express.Router();
const {
  register,
  login,
  forgetPassword,
  resetPassword,
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // if you have auth middleware

// Public routes
router.post('/register', register);
router.post('/login', login);
router.put('/forgetPassword', forgetPassword);
router.post('/resetPassword', resetPassword);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
