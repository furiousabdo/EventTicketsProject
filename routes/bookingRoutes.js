import express from "express";
import {
  bookTickets,
  getBookingById,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("user"), bookTickets);
router.get("/:id", protect, authorize("user"), getBookingById);
router.delete("/:id", protect, authorize("user"), cancelBooking);

export default router;
