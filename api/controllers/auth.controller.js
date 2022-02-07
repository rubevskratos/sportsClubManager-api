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

module.exports = {
  signup
  // login
}
