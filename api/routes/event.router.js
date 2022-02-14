const router = require('express').Router()

const {
  checkAuth,
  checkRole
} = require('../utils')

const {
  getEvents,
  getOneEvent,
  getParticipants,
  createEvent,
  updateEvent,
  deleteEvent,
  addParticipant,
  removeParticipant,
  returnOneEventItem,
  addMaterial,
  confirmEvent
} = require('../controllers/event.controller')

const {
  returnOneUserItem
} = require('../controllers/user.controller')

const {
  updateOneStock
} = require('../controllers/inventory.controller')

router.get('/', checkAuth, getEvents)
router.get('/:id', checkAuth, getOneEvent)
router.put('/:id/confirm', checkAuth, checkRole, confirmEvent)
router.put('/:id/materials/:itemId', checkAuth, checkRole, returnOneEventItem, returnOneUserItem, updateOneStock)
router.post('/:id/materials/:itemId', checkAuth, checkRole, addMaterial)
router.get('/:id/participants', checkAuth, getParticipants)
router.put('/:id/participants/:userId', checkAuth, addParticipant)
router.put('/:id/participants', checkAuth, addParticipant)
router.delete('/:id/participants/:userId', checkAuth, checkRole, removeParticipant)
router.post('/', checkAuth, checkRole, createEvent)
router.put('/:id', checkAuth, checkRole, updateEvent)
router.delete('/:id', checkAuth, checkRole, deleteEvent)

module.exports = router
