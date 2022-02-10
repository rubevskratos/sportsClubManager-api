
const Events = require('../models/event.model')
const Users = require('../models/user.model')

async function createEvent (req, res) {
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
    res.status(500).json(error)
    throw new Error(error)
  }
}

async function updateEvent (req, res) {
  try {
    const user = await Users.findOne({ email: res.locals.user.email })

    const event = await Events.findById(req.params.id)
      .populate('organizer')

    if (user.role !== 'admin' && event.organizer.id !== user.id) {
      res.status(403).send('Error: Only and administrator or event organized are authorized to update this event.')
    } else {
      for (const key in req.body) {
        if (Object.hasOwnProperty.call(req.body, key)) {
          const element = req.body[key]
          event[key] = element
        }
      }
      event.save()
    }
    res.status(200).json('Event updated')
  } catch (error) {
    res.status(500).json(error)
    throw new Error(error)
  }
}

async function deleteEvent (req, res) {
  try {
    const user = await Users.findOne({ email: res.locals.user.email })

    const event = await Events.findById(req.params.id)
      .populate('organizer')

    if (user.role !== 'admin' && event.organizer.id !== user.id) {
      res.status(403).send('Error: Only and administrator or event organized are authorized to delete this event.')
    } else {
      await Events.findByIdAndDelete(req.params.id)
    }
    res.send(200).json()
  } catch (error) {
    res.status(500).json(error)
    throw new Error(error)
  }
}

async function addParticipant (req, res) {
  try {
    const event = await Events.findById(req.params.id)
      .populate('participants')
      .populate('organizer')
    const user = await Users.findOne({ id: req.params.userId } || { email: res.locals.user.email })
      .populate('events')
    console.log(user)
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
        console.log(event.id)
        user.events.push(event.id)
        console.log(user)
        user.save()
        res.status(200).send('Success: Participant joined.')
      }
    }
  } catch (error) {
    res.status(500).send('Error: Server error')
  }
}

async function getEvents (req, res) {
  try {
    const events = await Events.find(req.query || {})
    res.status(200).json(events)
  } catch (error) {
    res.status(500).send('Error: Server error')
  }
}

async function getOneEvent (req, res) {
  try {
    const event = await Events.findById(req.params.id)
    res.status(200).json(event)
  } catch (error) {
    res.status(500).send('Error: Server error')
  }
}

async function getParticipants (req, res) {
  try {
    const event = await Events.findById(req.params.id)
    if (!event.participants) {
      res.status(403).send('Error: No participants found')
    } else {
      await event.populate('participants')
    }
    res.status(200).json(event.participants)
  } catch (error) {
    res.satatus(500).send('Error: Server error')
  }
}

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getOneEvent,
  getParticipants,
  addParticipant
}
