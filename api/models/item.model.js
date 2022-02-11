const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  properties: {
    subtype: { type: String },
    serialNumber: {
      type: String,
      unique: true,
      sparse: true
    },
    length: { type: Number },
    width: { type: Number },
    expiracy: { type: Date },
    size: { type: String },
    color: { type: String },
    tags: [{ type: String }],
    QRCode: { type: String }
  },
  qtyAvailable: {
    type: Number,
    required: true,
    default: 0
  },
  qtyBooked: {
    type: Number,
    required: true,
    default: 0
  },
  qtyDefect: {
    type: Number,
    required: true,
    default: 0
  },
  qtyOnHold: {
    type: Number,
    required: true,
    default: 0
  },
  qtyTotal: {
    type: Number, // [qtyAvailable + qtyBooked + qtyDefect + qtyOnHold]
    required: true,
    default: 0
  },
  created: {
    type: Date,
    required: true,
    default: new Date(),
    unmodifiable: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    unmodifiable: true
  }
})

const itemModel = mongoose.model('item', itemSchema)

module.exports = itemModel
