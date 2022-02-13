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
    ref: 'user',
    required: [true, 'Error: Event needs an organizer'],
    unmodifiable: true
  },
  maxParticipants: {
    type: Number,
    min: [process.env.MIN_EVENT_PARTICIPANTS, `Maximum number of participants cannot be less than ${process.env.MIN_EVENT_PARTICIPANTS}`]
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  materials: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'material',
        required: true
      },
      qtyBooked: {
        type: Number,
        min: [1, 'Cannot book 0 units']
      },
      qtyReturned: {
        type: Number,
        min: [0, 'Cannot return more than booked']
      },
      usedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        default: this.organizer
      },
      status: {
        type: String,
        required: true,
        enum: ['booked', 'in use', 'returned']
      },
      warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'warehouse',
        required: true
      }
    }
  ],
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'location'
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
