const router = require('express').Router()
const checkAuth = require('../utils')

const {
  getAllUsers,
  getUser,
  getOwnUser,
  updateOwnUser
} = require('../controllers/user.controller')

router.get('/', checkAuth, getAllUsers)

router.get('/profile', checkAuth, getOwnUser)
router.put('/profile', checkAuth, updateOwnUser)
router.get('/:userId', checkAuth, getUser)


module.exports = router
