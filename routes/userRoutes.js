const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const eventController = require('../controllers/eventController');

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

module.exports = router;
