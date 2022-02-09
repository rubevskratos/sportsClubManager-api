const router = require('express').Router()

const {
  signup,
  login
} = require('../controllers/auth.controller')

const {
  checkAuth
} = require('../utils')

router.post('/signup', signup)
router.post('/login', login)
router.get('/check', checkAuth, (req, res) => {
  res.send(res.locals.user)
})

module.exports = router
