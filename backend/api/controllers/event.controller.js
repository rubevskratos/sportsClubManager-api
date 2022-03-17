
const Events = require('../models/event.model')
const Users = require('../models/user.model')
const Items = require('../models/item.model')
const Warehouses = require('../models/warehouse.model')

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
    if (!req.body.eventId) { req.body.eventId = req.params.id }
    if (!req.body.usedBy) {
      req.body.usedBy = res.locals.user.id
    }

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
    const item = event.materials.find(element => {
      if (element.item.id === req.params.itemId && element.warehouse.id === req.body.warehouseId && element.usedBy.id === req.body.usedBy) {
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
    } else {
      res.status(400).send(`Error: Remaining quantity is ${remainingQty}`)
    }
  } catch (error) {
    next(error)
  }
}

async function addMaterial (req, res, next) {
  try {
    const event = await Events.findById(req.params.id)
      .populate('organizer')
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
          path: 'usedBy',
          model: 'user'
        }
      })
      .populate({
        path: 'materials',
        populate: {
          path: 'warehouse',
          model: 'warehouse'
        }
      })
    const warehouse = await Warehouses.findById(req.body.warehouse)
      .populate({
        path: 'items',
        populate: {
          path: 'itemId',
          model: 'item'
        }
      })
    const checkExists = warehouse.items.find(e => e.itemId.id === req.params.itemId)

    if (!checkExists) {
      req.status(400).json('Error: Item not found in this warehouse')
    } else {
      const item = await Items.findById(req.params.itemId)

      const eventMaterial = {
        item: item.id,
        qtyBooked: req.body.quantity,
        usedBy: req.body.usedBy ? req.body.usedBy : event.organizer.id,
        warehouse: req.body.warehouse,
        status: 'booked'
      }

      const userMaterial = {
        warehouseId: eventMaterial.warehouse,
        eventId: req.params.id,
        itemId: eventMaterial.item,
        quantity: eventMaterial.qtyBooked,
        status: eventMaterial.status

      }

      const user = await Users.findById(eventMaterial.usedBy)
      const checkItem = event.materials.find(element => {
        if (element.item.id === eventMaterial.item && element.usedBy.id === eventMaterial.usedBy && element.warehouse.id === eventMaterial.warehouse) {
          return true
        } else {
          return false
        }
      })

      if (checkItem) {
        res.status(403).send('Error: You have alredy requested this material for this user from this wharehouse')
      } else if (event.status !== 'planned') {
        res.status(403).send(`Error: You are not authorized to add materials to an event that is in status ${event.status}`)
      } else {
        event.materials.push(eventMaterial)
        event.save()
        user.materials.push(userMaterial)
        user.save()
        res.status(200).send('Sucess: Material added')
      }
    }
  } catch (error) {
    next(error)
  }
}

async function confirmEvent (req, res, next) {
  try {
    const inventoryData = []
    const eventId = req.params.id
    const event = await Events.findById(req.params.id)
      .populate('organizer')
      .populate('participants')
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
          path: 'usedBy',
          model: 'user'
        }
      })
      .populate({
        path: 'materials',
        populate: {
          path: 'warehouse',
          model: 'warehouse'
        }
      })

    const checkPermissions = res.locals.user.id === event.organizer.id || res.locals.user.role === 'admin'
    const checkMetParticipants = event.minParticipants === event.participants.length

    let checkStock = []
    for (let i = 0; i < event.materials.length; i++) {
      const element = event.materials[i]
      const elementWarehouse = await Warehouses.findById(element.warehouse.id)
        .populate({
          path: 'items',
          populate: {
            path: 'itemId',
            model: 'item'
          }
        })

      const warehouseItem = elementWarehouse.items.find(item => item.itemId.id === element.item.id)
      const itemIndex = elementWarehouse.items.indexOf(warehouseItem)
      if (elementWarehouse.items[itemIndex].quantityAvailable < element.qtyBooked) {
        checkStock.push(false)
      } else {
        checkStock.push(true)
      }
    }
    checkStock = checkStock.filter(el => el === false)
    if (checkStock.length > 0) {
      res.status(403).send('Error: There in not sufficient stock vailable')
    } else if (!checkPermissions) {
      res.status(403).send('Error: Only and administrator or event\'s organizer can confirm this event.')
    } else if (!checkMetParticipants) {
      res.status(403).send('Error: Minimum number of participants not met, event cannot be confirmed.')
    } else if (event.status !== 'planned') {
      res.status(403).send(`Error: Cannot confirm event. Current status is [${event.status}]. To confirm an event, status must be [planned]`)
    } else {
      // Actualizar el estado del evento
      event.status = 'confirmed'
      // Actualizar el estado de reserva de los materiales en el evento
      for (let i = 0; i < event.materials.length; i++) {
        const element = event.materials[i]
        element.status = 'in use'

        const user = await Users.findById(element.usedBy)
          .populate({
            path: 'materials',
            populate: {
              path: 'itemId',
              model: 'item'
            }
          })
          .populate({
            path: 'materials',
            populate: {
              path: 'warehouseId',
              model: 'warehouse'
            }
          })
          .populate({
            path: 'materials',
            populate: {
              path: 'eventId',
              model: 'event'
            }
          })

        const material = user.materials.find(el => {
          if (el.itemId.id === element.item.id && el.eventId.id === eventId && el.warehouseId.id === element.warehouse.id) {
            return true
          } else {
            return false
          }
        })
        const materialIndex = user.materials.indexOf(material)
        // Actualiza el estado de reserva de los materiales en el perfil del usuario
        user.materials[materialIndex].status = 'in use'
        user.save()

        // Crear un objeto JSON con los campos de almacén, itemId, quantity, movementType = 'in' y source = 'booking' para pasarlo al middleware del inventario y que actualice los almacenes.
        const inventoryItem = {
          warehouseId: element.warehouse.id,
          itemId: element.item.id,
          quantity: element.qtyBooked,
          movementType: 'out',
          source: 'booking'
        }
        inventoryData.push(inventoryItem)
      }
      event.save()
      res.inventoryData = inventoryData
      // Añadir el objeto JSON al cuerpo de la respuesta para pasarlo al middleware
      next()
    }
  } catch (error) {
    next(error)
  }
}

async function closeEvent (req, res, next) {
  try {
    const event = await Events.findById(req.params.id)
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
          path: 'usedBy',
          model: 'user'
        }
      })
      .populate('organizer')
      .populate('participants')

    const checkReturned = event.materials.filter(e => e.status !== 'returned')

    if (event.organizer.id !== res.locals.user.id && res.locals.user.role !== 'admin') {
      res.status(403).send('Error: Only event organizer or admin can close this event.')
    } else if (event.status === 'planned') {
      if (event.participants.length > 0) {
        for (let i = 0; i < event.participants.length; i++) {
          const element = event.participants[i]
          const user = await Users.findById(element.id)
            .populate('events')
          user.events = user.events.filter(e => e.id !== req.params.id)
          user.save()
        }
      }
      if (event.materials.length > 0) {
        for (let i = 0; i < event.materials.length; i++) {
          const element = event.materials[i]
          const user = await Users.findById(element.usedBy.id)
            .populate({
              path: 'materials',
              populate: {
                path: 'eventId',
                model: 'event'
              }
            })
          user.materials = user.materials.filter(e => e.eventId.id !== event.id)
          user.save()
        }
      }
      event.delete()
      res.status(200).send('Success: Planned event has been deleted')
    } else if (event.status === 'ended') {
      res.status(403).send('Error: Ended events cannot be closed again')
    } else if (checkReturned.length > 0) {
      res.status(500).send('Error: Cannot close an event while it has materials still in use')
    } else {
      event.status = 'ended'
      event.save()
      res.status(200).send('Success: Event has been ended.')
    }
  } catch (error) {
    next(error)
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
  returnOneEventItem,
  addMaterial,
  confirmEvent,
  closeEvent
}
