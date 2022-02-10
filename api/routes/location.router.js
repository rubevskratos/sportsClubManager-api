const router = require('express').Router()

const {
  getAllLocations,
  createLocation,
  getLocation,
  updateLocation,
  delectLocation
} = require('../controllers/location.controller')

const {
  checkAuth,
  checkAdmin
} = require('../utils')

router.get('/', checkAuth, getAllLocations)
router.post('/', checkAuth, checkAdmin, createLocation)
router.get('/:id', checkAuth, getLocation)
router.put('/:id', checkAuth, checkAdmin, updateLocation)
router.delete('/:id', checkAuth, checkAdmin, delectLocation)

module.exports = router
