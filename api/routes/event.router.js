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
  addParticipant
} = require('../controllers/event.controller')

router.get('/', checkAuth, getEvents)
router.get('/:id', checkAuth, getOneEvent)
router.get('/:id/participants', checkAuth, getParticipants)
router.put('/:id/participants/:userId', checkAuth, addParticipant)
router.put('/:id/participants', checkAuth, addParticipant)
router.post('/', checkAuth, checkRole, createEvent)
router.put('/:id', checkAuth, checkRole, updateEvent)
router.delete('/:id', checkAuth, checkRole, deleteEvent)

module.exports = router
