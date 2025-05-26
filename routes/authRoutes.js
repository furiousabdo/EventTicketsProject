const express = require('express');
const router = express.Router();
const {
    register,
    login,
    forgetPassword,
    getProfile,
    updateProfile,
    setupMFA,
    verifyMFA,
    verifyMFALogin,
    disableMFA
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authenticate } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgetPassword);
router.post('/reset-password', require('../controllers/resetPasswordController'));

// Protected routes
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);

// MFA routes
router.post('/mfa/setup', protect, setupMFA);
router.post('/mfa/verify', protect, verifyMFA);
router.post('/mfa/verify-login', verifyMFALogin);
router.post('/mfa/disable', protect, disableMFA);

router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
