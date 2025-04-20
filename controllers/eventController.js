const Event = require('../models/Event');

// Create an event
const createEvent = async (req, res) => {
  const { title, description, date, location, ticketsAvailable, price } = req.body;
  try {
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      organizer: req.user.id, // Organizer is the logged-in user
      ticketsAvailable,
      price,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name email');
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get events created by the organizer (user)
const getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id }).populate('organizer', 'name email');
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get event analytics (e.g., for an organizer to view booking stats)
const getEventAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    const eventStats = events.map(event => ({
      eventId: event._id,
      title: event.title,
      ticketsAvailable: event.ticketsAvailable,
      bookings: 0, // This could be connected to the booking model later
    }));

    res.json(eventStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Export all functions at the end
module.exports = {
  createEvent,
  getAllEvents,
  getUserEvents,
  getEventAnalytics,
};
