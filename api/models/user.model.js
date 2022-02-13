const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  postalCode: {
    type: String
  },
  state: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'This email has already been registered'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  materials: [
    {
      warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'warehouse',
        required: true
      },
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
        required: true
      },
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'material',
        required: true
      },
      quantity: {
        type: Number,
        min: [1, 'User cannot use less than 1 items'],
        required: true
      },
      status: {
        type: String,
        enum: ['booked', 'in use'],
        required: true
      }
    }
  ],
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'event'
    }
  ],
  created: {
    type: Date,
    default: new Date(),
    required: true,
    unmodifiable: true
  },
  role: {
    type: String,
    required: true,
    default: 'guest',
    enum: [
      'admin',
      'guest',
      'member'
    ]
  }
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel
