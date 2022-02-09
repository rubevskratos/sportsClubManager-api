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
  // getUserMaterials,
  // getUserEvents,
  getOwnUser,
  // getOwnUserMaterials,
  // getOwnUserEvents,
  updateOwnUser,
  deleteOwnUser
} = require('../controllers/user.controller')

router.get('/', checkAuth, getAllUsers)

// router.get('/profile/events', checkAuth, getOwnUserEvents)
// router.get('/profile/events', checkAuth, getOwnUserMaterials)
router.get('/profile', checkAuth, getOwnUser)
router.put('/profile', checkAuth, updateOwnUser)
router.delete('/profile', checkAuth, deleteOwnUser)

// router.get('/:id/events', checkAuth, getUserMaterials)
// router.get('/:id/events', checkAuth, getUserEvents)
router.get('/:id', checkAuth, getUser)
router.put('/:id', checkAuth, checkAdmin, updatetUser)
router.delete('/:id', checkAuth, deleteUser)

module.exports = router
