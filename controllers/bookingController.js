import Booking from '../models/Booking.js';
import Event from '../models/Event.js';

// Book tickets
export const bookTickets = async (req, res) => {
  try {
    const { eventId, ticketsBooked } = req.body;
    const event = await Event.findById(eventId);

    if (!event || event.status !== 'approved') {
      return res.status(404).json({ message: 'Event not found or not approved' });
    }

    if (event.tickets < ticketsBooked) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const totalPrice = ticketsBooked * event.price;

    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      ticketsBooked,
      totalPrice,
      status: 'confirmed',
    });

    event.tickets -= ticketsBooked;
    await event.save();

    res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current user's bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('event');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'canceled') {
      return res.status(400).json({ message: 'Booking already canceled' });
    }

    const event = await Event.findById(booking.event);
    if (event) {
      event.tickets += booking.ticketsBooked;
      await event.save();
    }

    booking.status = 'canceled';
    await booking.save();

    res.status(200).json({ message: 'Booking canceled and tickets refunded', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('event');

    if (!booking || booking.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
