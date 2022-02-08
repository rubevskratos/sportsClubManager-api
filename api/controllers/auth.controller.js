const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hash

    const user = await userModel.create(req.body)

    const token = jwt.sign({ email: user.email }, process.env.SECRET, { expiresIn: '7d' })

    res.status(200).json({ token })
  } catch (error) {
    console.log(error)
    res.status(500).send('Error creating user')
  }
}

const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.body.username })

    if (user === null) return res.status(500).send('Username or password not valid')

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) return res.status(500).send('Username or password not valid')

      const token = jwt.sign({ email: user.email }, process.env.SECRET, { expiresIn: '7d' })
      res.status(200).json({ token })
    })
  } catch (error) {
    console.log(error)
    res.status(500).send('Error login user')
  }
}

module.exports = {
  signup,
  login
}
