// controllers/eventController.js
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const asyncHandler = require('express-async-handler');

// Create event
exports.createEvent = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role === 'admin') {
    res.status(403);
    throw new Error('Admins are not allowed to create events');
  }

  const { title, description, date, location, price, totalTickets } = req.body;
  
  if (!totalTickets || isNaN(Number(totalTickets)) || Number(totalTickets) < 0) {
    res.status(400);
    throw new Error('Total tickets must be a valid positive number');
  }

  const parsedTotalTickets = Number(totalTickets);
  
  const event = await Event.create({
    title,
    description,
    date,
    location,
    price: Number(price),
    totalTickets: parsedTotalTickets,
    ticketsAvailable: parsedTotalTickets,
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
  const events = await Event.find().populate('organizer', 'name email');
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
  // Only update totalTickets if provided
  if (req.body.totalTickets !== undefined) {
    event.totalTickets = req.body.totalTickets;
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

  // Check permissions
  if (req.user.role === 'organizer' && !event.organizer.equals(req.user._id)) {
    res.status(403);
    throw new Error('Organizers can only delete their own events');
  }

  // Admin can delete any event
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

exports.getEventAnalytics = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  const bookings = await Booking.find({ event: eventId });
  const confirmed = bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.quantity, 0);
  const cancelled = bookings.filter(b => b.status === 'cancelled').reduce((sum, b) => sum + b.quantity, 0);
  const available = event.ticketsAvailable;
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const statusDistribution = [
    { status: 'Confirmed', value: confirmed },
    { status: 'Cancelled', value: cancelled },
    { status: 'Available', value: available }
  ];
  // Revenue by day (for the bar chart)
  const revenueByDayMap = {};
  bookings.forEach(b => {
    const date = b.createdAt.toISOString().split('T')[0];
    revenueByDayMap[date] = (revenueByDayMap[date] || 0) + b.totalPrice;
  });
  const revenueByDay = Object.entries(revenueByDayMap).map(([date, revenue]) => ({ date, revenue }));
  // Average tickets per booking
  const avgTicketsPerBooking = bookings.length > 0 ? (bookings.reduce((sum, b) => sum + b.quantity, 0) / bookings.length).toFixed(2) : 0;
  // Conversion rate (tickets booked / total tickets)
  const ticketsBooked = confirmed + cancelled;
  const conversionRate = event.totalTickets > 0 ? ((ticketsBooked / event.totalTickets) * 100).toFixed(2) : 0;
  // Days until event
  const daysUntilEvent = event.date ? Math.max(0, Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24))) : 'N/A';
  res.json({
    totalBookings,
    totalRevenue,
    statusDistribution,
    revenueByDay,
    avgTicketsPerBooking,
    conversionRate,
    daysUntilEvent,
    totalTickets: event.totalTickets,
    ticketsAvailable: event.ticketsAvailable
  });
});

// Get events for the current organizer
exports.getMyEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id });
  // Ensure totalTickets and ticketsAvailable are always numbers
  const fixedEvents = events.map(ev => ({
    ...ev.toObject(),
    totalTickets: Number(ev.totalTickets) || 0,
    ticketsAvailable: Number(ev.ticketsAvailable) || 0,
  }));
  res.json(fixedEvents);
});
