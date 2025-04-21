const express = require('express');
const eventController = require('../controllers/eventController');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');


const { protect, authorizeRoles, authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

// router.post('/events', protect, authorizeRoles('organizer'), eventController.createEvent);
// router.post('/bookings', protect, authorizeRoles('user'), bookingController.bookTickets);

router.post('/register', authController.register);  // ✅ Works after move
router.post('/login', authController.login);

router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);

module.exports = router;
