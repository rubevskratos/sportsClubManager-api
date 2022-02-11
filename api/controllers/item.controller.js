const Items = require('../models/item.model')

async function getAllItems (req, res) {
  try {
    const items = await Items.find(req.query || {})
    res.status(200).json(items)
  } catch (error) { res.send(error) }
}

async function createItem (req, res) {
  try {
    const item = await Items.create(req.body)
    res.status(200).json(item)
  } catch (error) { res.send(error) }
}

async function getItem (req, res) {
  try {
    const item = await Items.findById(req.params.id)
    res.status(200).json(item)
  } catch (error) { res.send(error) }
}

async function updateItem (req, res) {
  try {
    const item = await Items.findById(req.params.id)
    for (const param in req.body) {
      if (Object.hasOwnProperty.call(req.body, param)) {
        const element = req.body[param]
        item[param] = element
      }
    }
    item.save()
    res.status(200).json(item)
  } catch (error) { res.send(error) }
}

async function deletItem (req, res) {
  try {
    const item = await Items.findByIdAndDelete(req.params.id)
    res.status(200).json(item)
  } catch (error) { res.send(error) }
}

module.exports = {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deletItem
}
