
const Events = require('../models/event.model')
const Users = require('../models/user.model')

const { errorHandling } = require('../utils')

async function createEvent (req, res, next) {
  try {
    const user = await Users.findOne({ email: res.locals.user.email })
      .populate('events')
    if (!req.body.organizer) {
      req.body.organizer = user.id
    }
    const event = await Events.create(req.body)
    user.events.push(event.id)
    user.save()

    res.status(200).json(event)
  } catch (error) {
    next(error)
  }
}

async function updateEvent (req, res, next) {
  try {
    const user = await Users.findOne({ email: res.locals.user.email })
    const event = await Events.findById(req.params.id)
      .populate('organizer')

    if (user.role !== 'admin' && event.organizer.id !== user.id) {
      res.status(403).send('Error: Only an administrator or event organizer is authorized to update this event.')
    } else {
      for (const key in req.body) {
        if (Object.hasOwnProperty.call(req.body, key)) {
          const element = req.body[key]
          event[key] = element
        }
      }
      event.save()
      res.status(200).json('Event updated')
    }
  } catch (error) {
    next(error)
  }
}

async function deleteEvent (req, res, next) {
  try {
    const user = await Users.findOne({ email: res.locals.user.email })

    const event = await Events.findById(req.params.id)
      .populate('organizer')
      .populate('participants')

    const organizer = await Users.findById(event.organizer.id)
      .populate('events')

    if (user.role !== 'admin' && event.organizer.id !== user.id) {
      res.status(403).send('Error: Only an administrator or event organizer is authorized to delete this event.')
    } else {
      event.participants.forEach(async (participant) => {
        await participant.populate('events')
        participant.events = participant.events.filter(e => e.id !== event.id)
        participant.save()
      })
      organizer.events = organizer.events.filter(e => e.id !== event.id)
      organizer.save()
      await Events.findByIdAndDelete(req.params.id)
      res.status(200).json('Event deletion complete')
    }
  } catch (error) {
    next(error)
  }
}

async function addParticipant (req, res, next) {
  try {
    const event = await Events.findById(req.params.id)
      .populate('participants')
      .populate('organizer')
    const query = req.params.userId ? { id: req.params.userId } : { email: res.locals.user.email }
    const user = await Users.findOne(query)
      .populate('events')
    if (event.maxParticipants && event.participants.length === event.maxParticipants) {
      res.status(500).send('Error: This event is fully booked')
    } else {
      const checkAlreadyJoined = event.participants.find(e => e.id === user.id)
      const checkOrganizer = event.organizer.id === user.id
      if (checkAlreadyJoined || checkOrganizer) {
        res.status(500).send('Error: User already joined this event.')
      } else {
        event.participants.push(user.id)
        event.save()
        user.events.push(event.id)
        user.save()
        res.status(200).send('Success: Participant joined.')
      }
    }
  } catch (error) {
    next(error)
  }
}

async function removeParticipant (req, res, next) {
  try {
    const event = await Events.findById(req.params.id)
      .populate('organizer')
      .populate('participants')
    const participant = await Users.findById(req.params.userId)
      .populate('events')

    if (res.locals.user.role === 'admin' || event.organizer.email === res.locals.user.email || participant.email === res.locals.user.email) {
      event.participants = event.participants.filter(e => e.id !== participant.id)
      event.save()
      participant.events = participant.events.filter(e => e.id !== event.id)
      participant.save()
      res.status(200).send('Success: Participant has been removed.')
    } else {
      res.status(403).send('Error: You are not authorized to perform this action.')
    }
  } catch (error) {
    next(error)
  }
}

async function getEvents (req, res, next) {
  try {
    const events = await Events.find(req.query || {})
    res.status(200).json(events)
  } catch (error) {
    next(error)
  }
}

async function getOneEvent (req, res, next) {
  try {
    const event = await Events.findById(req.params.id)
    res.status(200).json(event)
  } catch (error) {
    next(error)
  }
}

async function getParticipants (req, res, next) {
  try {
    const event = await Events.findById(req.params.id)
    if (!event.participants) {
      res.status(403).send('Error: No participants found')
    } else {
      await event.populate('participants', { firstName: 1, lastName: 1, email: 1, materialHeld: 1, phone: 1, _id: 0 })
    }
    res.status(200).json(event.participants)
  } catch (error) {
    next(error)
  }
}

async function returnOneEventItem (req, res, next) {
  try {
    if (!req.body.source) { req.body.source = 'return' }
    if (!req.body.movementType) { req.body.movementType = 'in' }
    const event = await Events.findById(req.body.eventId)
      .populate({
        path: 'materials',
        populate: {
          path: 'item',
          model: 'item'
        }
      })
      .populate({
        path: 'materials',
        populate: {
          path: 'warehouse',
          model: 'warehouse'
        }
      })
      .populate({
        path: 'materials',
        populate: {
          path: 'usedBy',
          model: 'user'
        }
      })

    const item = event.materials.filter(element => {
      if (element.item.id === req.params.itemId && element.warehouse.id === req.body.warehouseId && element.usedBy.id === req.body.userId) {
        return true
      } else {
        return false
      }
    })
    const itemIndex = event.materials.indexOf(item)

    const remainingQty = item.qtyBooked - (item.qtyReturned + req.body.quantity)

    if (remainingQty < 0) {
      res.status(403).send('Error: You are not allowed to return more items than what you have currently in use')
    } else if (remainingQty === 0) {
      event.materials[itemIndex].qtyReturned = event.materials[itemIndex].qtyReturned + req.body.quantity
      event.materials[itemIndex].status = 'returned'
      event.save()
      next()
    } else if (remainingQty > 0) {
      event.materials[itemIndex].qtyReturned = event.materials[itemIndex].qtyReturned + req.body.quantity
      event.save()
      next()
    }
  } catch (error) {
    errorHandling(error)
  }
}

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getOneEvent,
  getParticipants,
  addParticipant,
  removeParticipant,
  returnOneEventItem
}
