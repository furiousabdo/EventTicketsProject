const express = require('express');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Event routes for organizers (create, get their events, analytics)
router.post('/events', authMiddleware.authenticate, authMiddleware.isOrganizer, eventController.createEvent);
router.get('/events', eventController.getAllEvents); // Anyone can view all events
router.get('/api/v1/users/events', authMiddleware.authenticate, authMiddleware.isOrganizer, eventController.getUserEvents);
router.get('/api/v1/users/events/analytics', authMiddleware.authenticate, authMiddleware.isOrganizer, eventController.getEventAnalytics);

module.exports = router;
