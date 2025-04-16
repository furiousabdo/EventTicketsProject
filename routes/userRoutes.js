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
router.get('/users/profile', authMiddleware.authenticate, userController.getProfile);
router.put('/users/profile', authMiddleware.authenticate, userController.updateProfile);
router.get('/users/bookings', authMiddleware.isUser, userController.getUserBookings);
router.get('/users/events', authMiddleware.isOrganizer, userController.getUserEvents);
router.get('/users/events/analytics', authMiddleware.isOrganizer, userController.getEventAnalytics);

module.exports = router;
