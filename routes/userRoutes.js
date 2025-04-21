const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const eventController = require('../controllers/eventController');

const router = express.Router();

// Admin routes
router.get('/', authMiddleware.isAdmin, userController.getAllUsers);
router.get('/:id', authMiddleware.isAdmin, userController.getUserById);
router.put('/:id', authMiddleware.isAdmin, userController.updateUserRole);
router.delete('/:id', authMiddleware.isAdmin, userController.deleteUser);

// Authenticated user routes
//router.post('/api/v1/register', userController.register); // For user registration
//router.post('/api/v1/login', userController.login); // For user login
router.get('/users/profile', authMiddleware.authenticate, userController.getProfile); // Current user profile
router.put('/users/profile', authMiddleware.authenticate, userController.updateProfile); // Update profile

module.exports = router;

