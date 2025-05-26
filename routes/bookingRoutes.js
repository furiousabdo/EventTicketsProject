const express = require('express');
const {
  bookTickets,
  getMyBookings,
  getBookingById,
  cancelBooking,
  deleteBooking
} = require('../controllers/bookingController');
const { authenticate } = require('../middleware/authMiddleware');
const { isUser, isAdmin, isOrganizer } = require('../middleware/roleMiddleware');

const router = express.Router();

// POST /api/v1/bookings — Book tickets for an event
router.post('/', authenticate, isUser, bookTickets);

// GET /api/v1/bookings/my-bookings — Get all bookings for the current user
router.get('/my-bookings', authenticate, isUser, getMyBookings);

// GET /api/v1/bookings/:id — Get booking details by ID
router.get('/:id', authenticate, isUser, getBookingById);

// DELETE /api/v1/bookings/:id — Delete a booking (Admin and Organizer only)
router.delete('/:id', authenticate, async (req, res, next) => {
  // Custom middleware to check if user is admin or organizer
  if (req.user.role !== 'admin' && req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Access denied. Admin or organizer role required.' });
  }
  next();
}, deleteBooking);

// POST /api/v1/bookings/:id/cancel — Cancel a booking
router.post('/:id/cancel', authenticate, isUser, cancelBooking);

module.exports = router;