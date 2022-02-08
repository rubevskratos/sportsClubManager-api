const Users = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function getAllUsers (req, res) {
  try {
    const query = req.query || {}
    const users = await Users.find(query)
    res.json(users)
  } catch (error) { res.send(error) }
}

async function getUser (req, res) {
  try {
    const user = await Users.findById(req.params.userId)
    res.json(user)
  } catch (error) { res.send(error) }
}

async function getOwnUser (req, res) {
  try {
    const user = await Users.find({email: res.locals.user.email})
    res.json(user)
  } catch (error) { res.send(error) }
}

async function updateOwnUser (req, res) {
  try {
    const user = await Users.findOne(res.locals.user) //Get user profile from database

    for (const param in req.body) { //For each param in the body, update user's param
      if (Object.hasOwnProperty.call(req.body, param)) {
        const element = req.body[param]
        user[param] = element
      }
    }
    user.save() //Save updated user
    
    if (req.body.password || req.body.email) { //if e-mail or password are updated, then release new token.
      const token = jwt.sign({ email: user.email }, process.env.SECRET, { expiresIn: '7d' })
      res.json({ token })
    } else {
      res.json(user)
    }

  } catch (error) { res.send(error) }
}

module.exports = {
  getAllUsers,
  getUser,
  getOwnUser,
  updateOwnUser
  // deleteUser
}
