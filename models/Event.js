const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tickets: Number,
  price: Number,
  status: { type: String, default: 'pending' },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
