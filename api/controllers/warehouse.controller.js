const Warehouses = require('../models/warehouse.model')
const Users = require('../models/user.model')

async function createWarehouse (req, res, next) {
  try {
    if (!req.body.createdBy) {
      req.body.createdBy = await Users.findOne({ email: res.locals.user.email })
    }
    const warehouse = await Warehouses.create(req.body)
    res.status(200).json(warehouse)
  } catch (error) {
    next(error)
  }
}

async function getWarehouses (req, res, next) {
  try {
    const result = await Warehouses.find(req.query || {})
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

async function getWarehouse (req, res, next) {
  try {
    const result = await Warehouses.findById(req.params.id)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

async function updateWarehouse (req, res, next) {
  try {
    const warehouse = await Warehouses.findByIdAndUpdate(req.params.id, req.body)
    warehouse.save()
    res.status(200).json(warehouse)
  } catch (error) {
    next(error)
  }
}

async function deleteWarehouse (req, res, next) {
  try {
    const warehouse = await Warehouses.findById(req.params.id)
      .populate('items')
    if (warehouse.items.length > 0) {
      res.status(403).send('Error: A warehouse with stock cannot be removed')
    } else {
      warehouse.delete()
      res.status(200).send('Success: warehouse has been removed')
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createWarehouse,
  getWarehouses,
  getWarehouse,
  updateWarehouse,
  deleteWarehouse
}
