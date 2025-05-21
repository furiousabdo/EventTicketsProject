// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/forgetPassword', forgetPassword);

// Authenticated routes (requires JWT)
router.get('/profile', authMiddleware.authenticate, authController.getProfile); // Get profile
router.put('/profile', authMiddleware.authenticate, authController.updateProfile); // Update profile

module.exports = router;
