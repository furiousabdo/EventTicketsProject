// routes/authRoutes.js
const express = require('express');
const {
    register,
    login,
    forgetPassword,
    getProfile,
    updateProfile
} = require('../controllers/authController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/forgetPassword', forgetPassword);

// profile routes
router
    .route('/profile')
    .get(authenticate, getProfile)
    .put(authenticate, updateProfile);

module.exports = router;
