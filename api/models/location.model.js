const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  coordinates: [{
    lat: {
      type: String,
      required: true
    },
    long: {
      type: String,
      required: true
    }
  }]
})

const locationModel = mongoose.model('location', locationSchema)

module.exports = locationModel
