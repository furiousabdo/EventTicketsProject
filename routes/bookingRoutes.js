import express from 'express';
import {
  bookTickets,
  getMyBookings,
  getBookingById,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/v1/bookings — Book tickets for an event
router.post('/', protect, authorize('user'), bookTickets);

// GET /api/v1/bookings/:id — Get booking details by ID
router.get('/:id', protect, authorize('user'), getBookingById);

// DELETE /api/v1/bookings/:id — Cancel a booking
router.delete('/:id', protect, authorize('user'), cancelBooking);

export default router;