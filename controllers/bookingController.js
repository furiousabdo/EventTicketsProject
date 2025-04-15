import Booking from "../models/bookingModel.js";
import Event from "../models/eventModel.js";

// Booking tickets part of the event
export const bookTickets = async (req, res) => {
  try {
    const { event, ticketsBooked } = req.body;
    const userId = req.user._id;

    const foundEvent = await Event.findById(event);
    if (!foundEvent) return res.status(404).json({ message: "Event not found" });

    if (foundEvent.availableTickets < ticketsBooked) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    const totalPrice = ticketsBooked * foundEvent.ticketPrice;

    const booking = await Booking.create({
      user: userId,
      event,
      ticketsBooked,
      totalPrice,
      status: "confirmed"
    });

    // Update available tickets
    foundEvent.availableTickets -= ticketsBooked;
    await foundEvent.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Retrieving all bookings for a user using the ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Ensure user owns the booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cancelling booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (booking.status === "canceled") {
      return res.status(400).json({ message: "Booking already got cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Return tickets back to the event
    const event = await Event.findById(booking.event);
    if (event) {
      event.availableTickets += booking.ticketsBooked;
      await event.save();
    }

    res.status(200).json({ message: "Booking has been cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
