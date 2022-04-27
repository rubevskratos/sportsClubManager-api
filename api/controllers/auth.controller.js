const Users = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signup = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hash

    const currentUsers = await Users.find({})
    const adminExists = currentUsers.find(el => el.role === 'admin')
    if (!req.body.role) { req.body.role = 'guest' }

    let user
    if (req.body.role !== 'guest' && adminExists) {
      res.status(403).send('Error: Admin user already exists, request role update to current admin.')
    } else {
      user = await Users.create(req.body)
    }

    const token = jwt.sign({ email: user.email }, process.env.SECRET, { expiresIn: '7d' })

    res.status(200).json({ token })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res) => {
  try {
    console.log('Req Body: ', req.body)
    const user = await Users.findOne({ email: req.body.email }).select('+password')

    if (!user) return res.status(500).send('Username or password not valid')

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) return res.status(500).send('Username or password not valid')
      if (!result) return res.status(500).send('Username or password not valid')
      const token = jwt.sign({ email: user.email }, process.env.SECRET, { expiresIn: '7d' })
      res.status(200).json({ token })
    })
  } catch (error) {
    console.log('Login error: ', error)
    res.status(500).send('Error login user')
  }
}

module.exports = {
  signup,
  login
}
