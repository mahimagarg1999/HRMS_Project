const mongoose = require('mongoose');
const officeEventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventTime: {
    type: String,
    required: true
  },
  eventDescription: {
    type: String,
    trim: true
  },
  eventLocation: {
    type: String,
    required: true,
    trim: true
  },
  participants: [{
    _id: false,
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['organizer', 'attendee'],
      default: 'attendee'
    }
  }],
  
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  }
});

module.exports = mongoose.model('Event', officeEventSchema);
