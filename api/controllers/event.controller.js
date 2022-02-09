const Events = require('../models/event.model')

async function createEvent (req, res) {
  try {
    const event = await Events.create(req.body)
    res.status(200).json(event)
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports = {
  createEvent
}
