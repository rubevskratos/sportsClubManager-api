const Events = require('../models/event.model')
const Users = require('../models/user.model')
async function createEvent (req, res) {
  try {
    if (!req.body.organizer) {
      const organizer = await Users.findOne({ email: res.locals.user.email })
      req.body.organizer = organizer.id
    }
    const event = await Events.create(req.body)
    res.status(200).json(event)
  } catch (error) {
    res.status(500).json(error)
    throw new Error(error)
  }
}

module.exports = {
  createEvent
}
