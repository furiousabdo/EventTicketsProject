const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  ticketsBooked: Number,
  totalPrice: Number,
  status: { type: String, default: 'pending' },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
