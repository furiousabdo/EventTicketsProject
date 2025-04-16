const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Admin routes
router.get('/users', authMiddleware.isAdmin, userController.getAllUsers);
router.get('/users/:id', authMiddleware.isAdmin, userController.getUserById);
router.put('/users/:id', authMiddleware.isAdmin, userController.updateUserRole);
router.delete('/users/:id', authMiddleware.isAdmin, userController.deleteUser);

// Authenticated user routes
router.post('/register', userController.register); // For user registration
router.post('/login', userController.login); // For user login
router.get('/users/profile', authMiddleware.authenticate, userController.getProfile); // Current user profile
router.put('/users/profile', authMiddleware.authenticate, userController.updateProfile); // Update profile

// Booking-related routes for users
router.get('/users/:id/bookings', authMiddleware.authenticate, userController.getUserBookings);

// Event-related routes for organizers
router.get('/users/:id/events', authMiddleware.isOrganizer, userController.getUserEvents);
router.get('/users/:id/events/analytics', authMiddleware.isOrganizer, userController.getEventAnalytics);

module.exports = router;
