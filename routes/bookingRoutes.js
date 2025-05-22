const express = require('express');
const {
  bookTickets,
  getMyBookings,
  getBookingById,
  cancelBooking
} = require('../controllers/bookingController');
const { authenticate } = require('../middleware/authMiddleware');
const { isUser } = require('../middleware/roleMiddleware');

const router = express.Router();

// POST /api/v1/bookings — Book tickets for an event
router.post('/', authenticate, isUser, bookTickets);

// GET /api/v1/bookings/my-bookings — Get all bookings for the current user
router.get('/my-bookings', authenticate, isUser, getMyBookings);

// GET /api/v1/bookings/:id — Get booking details by ID
router.get('/:id', authenticate, isUser, getBookingById);

// DELETE /api/v1/bookings/:id — Cancel a booking
router.delete('/:id', authenticate, isUser, cancelBooking);

// POST /api/v1/bookings/:id/cancel — Cancel a booking
router.post('/:id/cancel', authenticate, isUser, cancelBooking);

module.exports = router;