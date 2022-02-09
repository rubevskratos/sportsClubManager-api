const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Error: There\'s no title']
  },
  description: {
    type: String
  },
  startDate: {
    type: Date,
    required: true,
    default: new Date()
  },
  endDate: {
    type: Date,
    required: true,
    default: new Date()
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Error: Event needs an organizer'],
    unmodifiable: true
  },
  maxParticipants: {
    type: Number
  },
  minParticipants: {
    type: Number,
    required: true,
    min: [process.env.MIN_EVENT_PARTICIPANTS, `Minimum number of participants is ${process.env.MIN_EVENT_PARTICIPANTS}`],
    default: process.env.MIN_EVENT_PARTICIPANTS
  },
  status: {
    type: String,
    required: true,
    enum: ['planned', 'confirmed', 'in progress', 'ended'],
    default: 'planned'
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId
    }
  ],
  materials: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId
      },
      qtyBooked: {
        type: Number,
        min: [1, 'Cannot book 0 units']
      },
      usedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: this.organizer
      },
      status: {
        type: String,
        required: true,
        enum: ['in use', 'returned']
      }
    }
  ],
  location: {
    type: mongoose.Schema.Types.ObjectId
  },
  created: {
    type: Date,
    required: true,
    default: new Date(),
    unmodifiable: true
  }
})

const eventModel = mongoose.model('event', eventSchema)

module.exports = eventModel
