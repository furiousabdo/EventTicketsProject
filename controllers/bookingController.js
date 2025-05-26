// controllers/bookingController.js
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// Book tickets
exports.bookTickets = asyncHandler(async (req, res) => {
  const { eventId, quantity } = req.body;

  // Validate input
  if (!eventId || !quantity) {
    res.status(400);
    throw new Error('Event ID and quantity are required');
  }

  // Convert quantity to number and validate
  const numQuantity = Number(quantity);
  if (isNaN(numQuantity) || numQuantity < 1) {
    res.status(400);
    throw new Error('Invalid quantity');
  }

  try {
    // Find the event and check availability
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    // Check if enough tickets are available
    if (event.ticketsAvailable < numQuantity) {
      res.status(400);
      throw new Error('Not enough tickets available');
    }

    // Calculate total price
    const totalPrice = numQuantity * event.price;

    // Create the booking
    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      quantity: numQuantity,
      totalPrice,
      status: 'confirmed'
    });

    // Update available tickets using findOneAndUpdate to ensure atomicity
    const updatedEvent = await Event.findOneAndUpdate(
      { 
        _id: eventId, 
        ticketsAvailable: { $gte: numQuantity } 
      },
      { 
        $inc: { ticketsAvailable: -numQuantity } 
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedEvent) {
      // If update fails, delete the booking and throw error
      await Booking.findByIdAndDelete(booking._id);
      res.status(400);
      throw new Error('Failed to update ticket availability');
    }

    // Return the booking with event details
    const populatedBooking = await Booking.findById(booking._id).populate('event');
    res.status(201).json(populatedBooking);

  } catch (error) {
    res.status(res.statusCode === 200 ? 400 : res.statusCode);
    throw new Error(error.message || 'Failed to create booking');
  }
});

// Get booking by ID
exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('event');
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Allow access if user is the booking owner, an admin, or the event organizer
  const isOwner = booking.user.equals(req.user._id);
  const isAdmin = req.user.role === 'admin';
  const isOrganizer = req.user.role === 'organizer' && booking.event.organizer.equals(req.user._id);

  if (!isOwner && !isAdmin && !isOrganizer) {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  res.json(booking);
});

// Cancel booking
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('event');
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Allow cancellation if user is the booking owner, an admin, or the event organizer
  const isOwner = booking.user.equals(req.user._id);
  const isAdmin = req.user.role === 'admin';
  const isOrganizer = req.user.role === 'organizer' && booking.event.organizer.equals(req.user._id);

  if (!isOwner && !isAdmin && !isOrganizer) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  try {
    // Update event tickets atomically
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: booking.event._id },
      { $inc: { ticketsAvailable: booking.quantity } },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      res.status(400);
      throw new Error('Failed to update event tickets');
    }

    // Update booking status atomically
    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: booking._id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!updatedBooking) {
      // Rollback the event update if booking update fails
      await Event.findOneAndUpdate(
        { _id: booking.event._id },
        { $inc: { ticketsAvailable: -booking.quantity } }
      );
      res.status(400);
      throw new Error('Failed to cancel booking');
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(res.statusCode === 200 ? 400 : res.statusCode);
    throw new Error(error.message || 'Failed to cancel booking');
  }
});

// Delete booking (Admin and Organizer only)
exports.deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('event');
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Only allow admins and event organizers to delete bookings
  const isAdmin = req.user.role === 'admin';
  const isOrganizer = req.user.role === 'organizer' && booking.event.organizer.equals(req.user._id);

  if (!isAdmin && !isOrganizer) {
    res.status(403);
    throw new Error('Not authorized to delete this booking');
  }

  // If the booking is confirmed, update the event tickets
  if (booking.status === 'confirmed') {
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: booking.event._id },
      { $inc: { ticketsAvailable: booking.quantity } },
      { new: true }
    );

    if (!updatedEvent) {
      res.status(400);
      throw new Error('Failed to update event tickets');
    }
  }

  await booking.deleteOne();
  res.json({ message: 'Booking deleted successfully' });
});

// Get all bookings for the current user
exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('event');
  res.json(bookings);
});

// Properly export all functions
module.exports = {
  bookTickets: exports.bookTickets,
  getMyBookings: exports.getMyBookings,
  getBookingById: exports.getBookingById,
  cancelBooking: exports.cancelBooking,
  deleteBooking: exports.deleteBooking
};
