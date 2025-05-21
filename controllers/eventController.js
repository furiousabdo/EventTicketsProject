// controllers/eventController.js
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const asyncHandler = require('express-async-handler');

// Create event
exports.createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, price, ticketsAvailable } = req.body;
  const event = await Event.create({
    title, description, date, location, price, ticketsAvailable,
    organizer: req.user._id
  });
  res.status(201).json(event);
});

// Get approved events
exports.getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ status: 'approved' });
  res.json(events);
});

// Get all events (admin)
exports.getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Get single event
exports.getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  res.json(event);
});

// Update event
exports.updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  if (req.user.role === 'Organizer' && !event.organizer.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to update this event');
  }
  Object.assign(event, req.body);
  const updated = await event.save();
  res.json(updated);
});

// Delete event
exports.deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  if (req.user.role === 'Organizer' && !event.organizer.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to delete this event');
  }
  await event.deleteOne();
  res.json({ message: 'Event removed' });
});

// Organizer analytics
exports.getMyEventsAnalytics = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id });
  const analytics = await Promise.all(events.map(async ev => {
    const booked = await Booking.countDocuments({ event: ev._id });
    return {
      eventId: ev._id,
      title: ev.title,
      ticketsAvailable: ev.ticketsAvailable,
      ticketsBooked: booked,
      percentageBooked: ((booked / (ev.ticketsAvailable + booked)) * 100).toFixed(2)
    };
  }));
  res.json(analytics);
});
