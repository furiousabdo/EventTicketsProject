// routes/eventRoutes.js
const express = require('express');
const {
    createEvent,
    getEvents,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getMyEventsAnalytics,
    getEventAnalytics,
    getMyEvents
} = require('../controllers/eventController');
const { protect, allowRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/admin/events', protect, allowRoles('admin'), getAllEvents);
router.put('/admin/events/:id/status', protect, allowRoles('admin'), async (req, res) => {
  try {
    console.log('Status update payload:', req.body);
    const event = await require('../models/Event').findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    event.status = req.body.status;
    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

router
    .route('/')
    .post(protect, allowRoles('organizer'), createEvent)
    .get(getEvents);

router.get('/all', protect, allowRoles('admin'), getAllEvents);
router.get('/my-events', protect, allowRoles('organizer'), getMyEvents);
router.get('/:id', getEventById);
router
    .route('/:id')
    .put(protect, allowRoles('organizer','admin'), updateEvent)
    .delete(protect, allowRoles('organizer','admin'), deleteEvent);

router.get('/analytics', protect, allowRoles('organizer'), getMyEventsAnalytics);
router.get('/:id/analytics', protect, allowRoles('organizer'), getEventAnalytics);

module.exports = router;