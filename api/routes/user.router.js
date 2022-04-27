const router = require('express').Router()
const {
  checkAuth,
  checkAdmin
} = require('../utils')

const {
  getAllUsers,
  getUser,
  updatetUser,
  deleteUser,
  getUserMaterials,
  getUserEvents,
  getOwnUser,
  getOwnUserMaterials,
  getOwnUserEvents,
  updateOwnUser,
  deleteOwnUser,
  returnOneUserItem
} = require('../controllers/user.controller')

const {
  returnOneEventItem
} = require('../controllers/event.controller')

const {
  updateOneStock
} = require('../controllers/inventory.controller')

router.get('/', checkAuth, getAllUsers)

router.get('/profile/events', checkAuth, getOwnUserEvents)
router.get('/profile/materials', checkAuth, getOwnUserMaterials)
router.put('/profile/materials/return/:itemId', checkAuth, returnOneUserItem, returnOneEventItem, updateOneStock)
router.get('/profile', checkAuth, getOwnUser)
router.put('/profile', checkAuth, updateOwnUser)
router.delete('/profile', checkAuth, deleteOwnUser)

router.get('/:id/events', checkAuth, getUserEvents)
router.get('/:id/materials', checkAuth, getUserMaterials)
router.get('/:id', checkAuth, getUser)
router.put('/:id', checkAuth, checkAdmin, updatetUser)
router.delete('/:id', checkAuth, checkAdmin, deleteUser)

module.exports = router
