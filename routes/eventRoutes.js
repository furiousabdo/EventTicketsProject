// routes/eventRoutes.js
const express = require('express');
const {
    createEvent,
    getEvents,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getMyEventsAnalytics
} = require('../controllers/eventController');
const { protect, allowRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router
    .route('/')
    .post(protect, allowRoles('Organizer'), createEvent)
    .get(getEvents);

router.get('/all', protect, allowRoles('Admin'), getAllEvents);
router.get('/:id', getEventById);
router
    .route('/:id')
    .put(protect, allowRoles('Organizer','Admin'), updateEvent)
    .delete(protect, allowRoles('Organizer','Admin'), deleteEvent);

router.get('/analytics', protect, allowRoles('Organizer'), getMyEventsAnalytics);

module.exports = router;
