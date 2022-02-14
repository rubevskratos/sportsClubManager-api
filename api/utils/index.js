const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

const checkAuth = (req, res, next) => {
  if (!req.headers.token) return res.status(500).send('User not logged in')

  jwt.verify(req.headers.token, process.env.SECRET, async (err, decoded) => {
    if (err) return res.status(500).send('Token not valid')
    const user = await userModel.findOne({ email: decoded.email })

    if (!user) return res.status(500).send('Token not valid')
    else {
      res.locals.user = {
        id: user.id,
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
  if (res.locals.user?.role === 'admin' || res.locals.user?.role === 'member') {
    next()
  } else {
    res.status(403).json('Error: You\'re not authorized to perform this action.')
  }
}

const checkAdmin = (req, res, next) => {
  if (res.locals.user?.role === 'admin') {
    next()
  } else {
    res.status(403).send('Error: You\'re not authorized to perform this action.')
  }
}

module.exports = {
  checkAuth,
  checkRole,
  checkAdmin
}
