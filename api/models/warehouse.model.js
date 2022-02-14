const mongoose = require('mongoose')

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['open', 'maintenance', 'closed'],
    default: 'open'
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'item'
      },
      quantityAvailable: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Error: No puede haber menos de 0 unidades']
      },
      quantityBooked: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Error: No puede haber menos de 0 unidades']
      },
      quantityDefect: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Error: No puede haber menos de 0 unidades']
      },
      totalQuantity: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Error: No puede haber menos de 0 unidades']
      }
    }
  ],
  created: {
    type: Date,
    required: true,
    default: new Date(),
    unmodifiable: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
})

const warehouseModel = mongoose.model('warehouse', warehouseSchema)
module.exports = warehouseModel
