const Users = require('../models/user.model')

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

module.exports = {
  getAllUsers,
  getUser
  // updateUser,
  // deleteUser
}
