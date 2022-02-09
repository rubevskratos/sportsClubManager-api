const router = require('express').Router()

const {
  checkAuth,
  // checkRole,
  checkAdmin
} = require('../utils')

const {
  createEvent
} = require('../controllers/event.controller')

router.post('/', checkAuth, checkAdmin, createEvent)

module.exports = router
