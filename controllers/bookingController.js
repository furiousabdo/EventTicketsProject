// controllers/bookingController.js
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');

// Book tickets
exports.bookTickets = asyncHandler(async (req, res) => {
  const { eventId, quantity } = req.body;
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  if (event.ticketsAvailable < quantity) {
    res.status(400);
    throw new Error('Not enough tickets available');
  }
  event.ticketsAvailable -= quantity;
  await event.save();
  const totalPrice = quantity * event.price;
  const booking = await Booking.create({
    user: req.user._id,
    event: eventId,
    quantity,
    totalPrice,
    status: 'confirmed'
  });
  res.status(201).json(booking);
});

// Get booking by ID
exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('event');
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (!booking.user.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }
  res.json(booking);
});

// Cancel booking
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (!booking.user.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }
  const event = await Event.findById(booking.event);
  event.ticketsAvailable += booking.quantity;
  await event.save();
  booking.status = 'cancelled';
  await booking.save();
  res.json({ message: 'Booking cancelled' });
});

// Get all bookings for the current user
exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('event');
  res.json(bookings);
});

// Properly export all functions for destructuring
module.exports = {
  bookTickets: exports.bookTickets,
  getMyBookings: exports.getMyBookings,
  getBookingById: exports.getBookingById,
  cancelBooking: exports.cancelBooking
};
