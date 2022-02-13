const Users = require('../models/user.model')

const { errorHandling } = require('../utils')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function getAllUsers (req, res, next) {
  try {
    const query = req.query || {}
    const users = await Users.find(query)
    res.status(200).json(users)
  } catch (error) { next(error) }
}

async function getUser (req, res, next) {
  try {
    const user = await Users.findById(req.params.id)
    res.status(200).json(user)
  } catch (error) { next(error) }
}

async function updatetUser (req, res, next) {
  try {
    const user = await Users.findById(req.params.id) // Get user profile from database

    if (req.body.password) {
      const hash = bcrypt.hashSync(req.body.password, 10)
      req.body.password = hash
    }

    for (const param in req.body) { // For each param in the body, update user's param, ignores updates in materials or events through this route, and checks for admin on role updates.
      if (Object.hasOwnProperty.call(req.body, param)) {
        if (param !== 'materials' || param !== 'events') {
          if (param === 'role' && res.locals.user.role !== 'admin') {
            res.send(403).send('Error: Only an administrator can update user roles')
          } else {
            const element = req.body[param]
            user[param] = element
          }
        }
      }
    }
    user.save() // Save updated user

    if (req.body.password || req.body.email) { // if e-mail or password are updated, then release new token.
      const token = jwt.sign({ email: user.email }, process.env.SECRET, { expiresIn: '7d' })
      res.json({ token })
    } else {
      res.json(user)
    }
  } catch (error) { next(error) }
}

async function deleteUser (req, res, next) {
  try {
    const user = await Users.findById(req.params.id)
      .populate('materials')
      .populate('events')

    const materialsInUse = user.materials.filter(e => e.status === 'in use').length
    const eventsInProgress = user.materials.filter(e => e.status === 'in progress').length

    if (materialsInUse > 0 || eventsInProgress > 0) {
      res.status(403).send('Error: User cannot be deleted while it still has materials in use or events in progress')
    } else {
      user.delete()
      res.status(200).json('Succeed: User has been deleted')
    }
  } catch (error) { next(error) }
}

async function getUserMaterials (req, res, next) {
  try {
    const user = await Users.findById(req.params.id)
      .populate('materials')
    res.status(200).json(user.materials)
  } catch (error) { next(error) }
}

async function getUserEvents (req, res, next) {
  try {
    const user = await Users.findById(req.params.id)
      .populate('events')
    res.status(200).json(user.events)
  } catch (error) { next(error) }
}

async function getOwnUser (req, res, next) {
  try {
    const user = await Users.find({ email: res.locals.user.email })
    res.status(200).json(user)
  } catch (error) { next(error) }
}

async function getOwnUserMaterials (req, res, next) {
  try {
    const user = await Users.findOne(res.locals.users)
      .populate('materials')
    res.status(200).json(user.materials)
  } catch (error) { next(error) }
}

async function getOwnUserEvents (req, res, next) {
  try {
    const user = await Users.findOne(res.locals.users)
      .populate('events')
    res.status(200).json(user.events)
  } catch (error) { next(error) }
}

async function updateOwnUser (req, res, next) {
  try {
    const user = await Users.findOne(res.locals.user) // Get user profile from database

    if (req.body.password) {
      const hash = bcrypt.hashSync(req.body.password, 10)
      req.body.password = hash
    }

    for (const param in req.body) { // For each param in the body, update user's param
      if (Object.hasOwnProperty.call(req.body, param)) {
        if (param !== 'materials' || param !== 'events') {
          if (param === 'role' && res.locals.user.role !== 'admin') {
            res.send(403).send('Error: Only an administrator can update user roles')
          } else {
            const element = req.body[param]
            user[param] = element
          }
        }
      }
    }
    user.save() // Save updated user

    if (req.body.password || req.body.email) { // if e-mail or password are updated, then release new token.
      const token = jwt.sign({ email: user.email }, process.env.SECRET, { expiresIn: '7d' })
      res.status(200).json({ token })
    } else {
      res.status(200).json(user)
    }
  } catch (error) { next(error) }
}

async function deleteOwnUser (req, res, next) {
  try {
    const user = await Users.findOne({ email: res.locals.user.email })
      .populate('materials')
      .populate('events')

    const materialsInUse = user.materials.filter(e => e.status === 'in use').length
    const eventsInProgress = user.materials.filter(e => e.status === 'in progress').length

    if (materialsInUse > 0 || eventsInProgress > 0) {
      res.status(403).send('Error: User cannot be deleted while it still has materials in use or events in progress')
    } else {
      user.delete()
      res.status(200).json('Succeed: User has been deleted')
    }
  } catch (error) { next(error) }
}

async function returnOneUserItem (req, res, next) {
  try {
    if (!req.body.source) { req.body.source = 'return' }
    if (!req.body.movementType) { req.body.movementType = 'in' }
    const usedBy = res.headers.userId ? res.headers.userId : await Users.findOne(res.locals.user).id
    const user = await Users.findById(usedBy)
      .populate({
        path: 'materials',
        populate: {
          path: 'warehouseId',
          model: 'warehouse'
        }
      })
      .populate({
        path: 'materials',
        populate: {
          path: 'eventId',
          model: 'event'
        }
      })
      .populate({
        path: 'materials',
        populate: {
          path: 'itemId',
          model: 'item'
        }
      })

    const item = user.materials.find(element => {
      if (element.warehouseId.id === req.body.warehouseId && element.eventId.id === req.body.eventId && element.itemId.id === req.params.itemId) {
        return true
      } else {
        return false
      }
    })
    const itemIndex = user.materials.indexOf(item)

    if (item.status !== 'in use') {
      res.status(403).send('Error: You are not allowed to return items that are in a booked status')
    } else {
      const remainingQty = item.quantity - req.body.quantity
      if (remainingQty < 0) {
        res.status(403).send('Error: You are not allowed to return more items than what you have currently in use')
      } else if (remainingQty === 0) {
        user.materials = user.materials.filter(element => {
          if (element.warehouseId.id === req.body.warehouseId && element.eventId.id === req.body.eventId && element.itemId.id === req.params.itemId) {
            return false
          } else {
            return true
          }
        })
        user.save()
        next()
      } else if (remainingQty > 0) {
        user.materials[itemIndex].quantity = remainingQty
        user.save()
        next()
      }
    }
  } catch (error) {
    errorHandling(error) // exceptionally used here to avoid sending error to the event controller
  }
}

module.exports = {
  getAllUsers,
  getUser,
  updatetUser,
  deleteUser,
  getUserMaterials,
  getUserEvents,
  getOwnUser,
  getOwnUserMaterials,
  updateOwnUser,
  getOwnUserEvents,
  deleteOwnUser,
  returnOneUserItem
}
