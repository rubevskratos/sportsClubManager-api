const router = require('express').Router()

const {
  getAllUsers,
  getUser
} = require('../controllers/user.controller')

router.get('/', getAllUsers)
router.get('/:userId', getUser)

module.exports = router
