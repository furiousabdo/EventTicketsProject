const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const eventController = require('../controllers/eventController');
const bookingController = require('../controllers/bookingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');


// Admin-only route
router.get('/users', protect, authorizeRoles('admin'), getAllUsers);

// Organizer-only route
router.post('/events', protect, authorizeRoles('organizer'), createEvent);

// Standard user-only route
router.post('/bookings', protect, authorizeRoles('user'), bookTickets);


const router = express.Router();

// Public routes
router.post('/register', authController.register); // Register a new user
router.post('/login', authController.login); // Login user
router.get('/profile', protect, getProfile);

// Authenticated routes (requires JWT)
router.get('/profile', authMiddleware.authenticate, authController.getProfile); // Get profile
router.put('/profile', authMiddleware.authenticate, authController.updateProfile); // Update profile

module.exports = router;
