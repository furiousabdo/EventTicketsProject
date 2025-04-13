import express from 'express';
import { getMyBookings } from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/v1/users/bookings — Get current user's bookings
router.get('/bookings', protect, authorize('user'), getMyBookings);

export default router;