const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

const checkAuth = (req, res, next) => {
  if (!req.headers.token) return res.status(500).send('User not logged in')

  jwt.verify(req.headers.token, process.env.SECRET, async (err, decoded) => {
    if (err) return res.status(500).send('Token not valid')
    const user = await userModel.findOne({ email: decoded.email })
    console.log(user)

    if (!user) return res.status(500).send('Token not valid')
    else {
      res.locals.user = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
      next()
    }
  })
}

const checkRole = (req, res, next) => {
  if (!res.locals.user) return res.status(400).send('User data was not found')
  if (res.locals.user.role !== 'member' || res.locals.user.role !== 'admin') return res.status(500).send('Error: User rights not met')
  next()
}

const checkAdmin = (req, res, next) => {
  if (res.locals.user?.role === 'admin') {
    next()
  } else {
    res.status(403).send(res.locals.user)
  }
}

module.exports = {
  checkAuth,
  checkRole,
  checkAdmin
}
