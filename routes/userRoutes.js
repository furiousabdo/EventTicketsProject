const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const eventController = require('../controllers/eventController');
const roleMiddleware = require('../middleware/roleMiddleware'); // Assuming you have a roleMiddleware for checking roles

const router = express.Router();

// Admin routes
router.get('/', roleMiddleware.isAdmin, userController.getAllUsers);
router.get('/:id', roleMiddleware.isAdmin, userController.getUserById);
router.put('/:id', roleMiddleware.isAdmin, userController.updateUserRole);
router.delete('/:id', roleMiddleware.isAdmin, userController.deleteUser);

// Authenticated user routes
//router.post('/api/v1/register', userController.register); // For user registration
//router.post('/api/v1/login', userController.login); // For user login
router.get('/users/profile', authMiddleware.authenticate, userController.getProfile); // Current user profile
router.put('/users/profile', authMiddleware.authenticate, userController.updateProfile); // Update profile

module.exports = router;

