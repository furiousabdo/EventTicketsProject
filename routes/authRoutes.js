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
router.put('/forgetPassword', forgetPassword);
router.get('/me', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// MFA routes
router.post('/mfa/setup', authenticate, setupMFA);
router.post('/mfa/verify', authenticate, verifyMFA);
router.post('/mfa/verify-login', verifyMFALogin);
router.post('/mfa/disable', authenticate, disableMFA);

router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

router.post('/forgot-password', require('../controllers/forgotPasswordController'));

module.exports = router;
