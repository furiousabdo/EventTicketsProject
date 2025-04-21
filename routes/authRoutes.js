const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const {forgotPassword, resetPasswordWithOTP} = require('../controllers/authController');
const router = express.Router();

// Public routes
router.post('/register', authController.register); // Register a new user
router.post('/login', authController.login); // Login user

// Authenticated routes (requires JWT)
router.get('/profile', authMiddleware.authenticate, authController.getProfile); // Get profile
router.put('/profile', authMiddleware.authenticate, authController.updateProfile); // Update profile
router.put('/forgetPassword', forgotPassword);
router.put('/resetPasswordWithOTP', resetPasswordWithOTP);
module.exports = router;
