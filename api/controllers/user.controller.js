const Users = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function getAllUsers (req, res) {
  try {
    const query = req.query || {}
    const users = await Users.find(query)
    res.status(200).json(users)
  } catch (error) { res.send(error) }
}

async function getUser (req, res) {
  try {
    const user = await Users.findById(req.params.id)
    res.status(200).json(user)
  } catch (error) { res.send(error) }
}

async function updatetUser (req, res) {
  try {
    const user = await Users.findById(req.params.id) // Get user profile from database

    if (req.body.password) {
      const hash = bcrypt.hashSync(req.body.password, 10)
      req.body.password = hash
    }

    for (const param in req.body) { // For each param in the body, update user's param
      if (Object.hasOwnProperty.call(req.body, param)) {
        const element = req.body[param]
        user[param] = element
      }
    }
    user.save() // Save updated user

    if (req.body.password || req.body.email) { // if e-mail or password are updated, then release new token.
      const token = jwt.sign({ email: user.email }, process.env.SECRET, { expiresIn: '7d' })
      res.json({ token })
    } else {
      res.json(user)
    }
  } catch (error) { res.send(error) }
}

async function deleteUser (req, res) {
  try {
    await Users.findByIdAndDelete(req.params.id)
    res.status(200).json('Usuario eliminado')
  } catch (error) { res.send(error) }
}

/* async function getUserMaterials (req, res) {
  try {
    const materials = await Users.findById(req.params.id).populate('materials')
    res.json(materials)
  } catch (error) { res.send(error) }
} */

/* async function getUserEvents (req, res) {
  try {
    const events = await Users.findById(req.params.id).populate('events')
    res.json(events)
  } catch (error) { res.send(error) }
} */

async function getOwnUser (req, res) {
  try {
    const user = await Users.find({ email: res.locals.user.email })
    res.status(200).json(user)
  } catch (error) { res.send(error) }
}

/* async function getOwnUserMaterials (req, res) {
  try {
    const materials = await Users.findOne(res.locals.users).populate('materials')
    res.json(materials)
  } catch (error) { res.send(error) }
} */

/* async function getOwnUserEvents (req, res) {
  try {
    const events = await Users.findOne(res.locals.users).populate('events')
    res.json(events)
  } catch (error) { res.send(error) }
} */

async function updateOwnUser (req, res) {
  try {
    const user = await Users.findOne(res.locals.user) // Get user profile from database

    if (req.body.password) {
      const hash = bcrypt.hashSync(req.body.password, 10)
      req.body.password = hash
    }

    for (const param in req.body) { // For each param in the body, update user's param
      if (Object.hasOwnProperty.call(req.body, param)) {
        const element = req.body[param]
        user[param] = element
      }
    }
    user.save() // Save updated user

    if (req.body.password || req.body.email) { // if e-mail or password are updated, then release new token.
      const token = jwt.sign({ email: user.email }, process.env.SECRET, { expiresIn: '7d' })
      res.status(200).json({ token })
    } else {
      res.status(200).json(user)
    }
  } catch (error) { res.send(error) }
}

async function deleteOwnUser (req, res) {
  try {
    await Users.findOneAndDelete(res.locals.user)
    res.status(200).json('Usuario eliminado')
  } catch (error) { res.send(error) }
}

module.exports = {
  getAllUsers,
  getUser,
  updatetUser,
  deleteUser,
  // getUserMaterials,
  // getUserEvents,
  getOwnUser,
  // getOwnUserMaterials,
  updateOwnUser,
  // getOwnUserEvents
  deleteOwnUser
}
