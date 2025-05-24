// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  totalTickets: { 
    type: Number, 
    required: [true, 'Total tickets is required'],
    min: [0, 'Total tickets cannot be negative']
  },
  ticketsAvailable: { 
    type: Number, 
    required: [true, 'Available tickets is required'],
    min: [0, 'Available tickets cannot be negative'],
    validate: {
      validator: function(value) {
        // Only validate if this is a new document or totalTickets is being modified
        if (this.isNew || this.isModified('totalTickets')) {
          return value <= this.totalTickets;
        }
        return true;
      },
      message: 'Available tickets cannot exceed total tickets'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Add a pre-save hook to set initial ticketsAvailable if not set
eventSchema.pre('save', function(next) {
  if (this.isNew && this.ticketsAvailable === undefined) {
    this.ticketsAvailable = this.totalTickets;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
