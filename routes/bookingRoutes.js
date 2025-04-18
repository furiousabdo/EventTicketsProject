import express from 'express';
import {
  bookTickets,
  getMyBookings,
  getBookingById,
  cancelBooking
} from '../controllers/bookingController.js';
import { authenticate, isUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/v1/bookings — Book tickets for an event
router.post('/', authenticate, isUser, bookTickets);

// GET /api/v1/bookings/:id — Get booking details by ID
router.get('/:id', authenticate, isUser, getBookingById);

// DELETE /api/v1/bookings/:id — Cancel a booking
router.delete('/:id', authenticate, isUser, cancelBooking);

export default router;
