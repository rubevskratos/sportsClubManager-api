const Location = require('../models/location.model')

async function getAllLocations (req, res) {
  try {
    const locations = await Location.find()
    res.json(locations)
  } catch (error) { res.send(error) }
}

async function createLocation (req, res) {
  try {
    const location = await Location.create(req.body)
    res.status(200).json('Localización creada')
  } catch (error) { res.send(error) }
}

async function getLocation (req, res) {
  try {
    const location = await Location.findById(req.params.id) // Get location from database
    res.json(location)
  } catch (error) { res.send(error) }
}

async function updateLocation (req, res) {
  try {
    const location = await Location.findById(req.params.id)
    console.log(location)
    for (const param in req.body) { // For each param in the body, update location param
      if (Object.hasOwnProperty.call(req.body, param)) {
        const element = req.body[param]
        location[param] = element
      }
    }
    location.save()
    res.status(200).json(location)
  } catch (error) { res.send(error) }
}

async function delectLocation (req, res) {
  try {
    await Location.findByIdAndDelete(req.params.id)
    res.status(200).json('Localización eliminada')
  } catch (error) { res.send(error) }
}

module.exports = {
  getAllLocations,
  createLocation,
  getLocation,
  updateLocation,
  delectLocation
}
