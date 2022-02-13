const Warehouses = require('../models/warehouse.model')
const Users = require('../models/user.model')
const Items = require('../models/item.model')

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

async function addWarehouseItem (req, res, next) {
  try {
    const item = await Items.findById(req.params.itemId)
    const warehouse = await Warehouses.findById(req.params.id)
      .populate({
        path: 'items',
        populate: {
          path: 'itemId',
          model: 'item'
        }
      })

    const warehouseItem = warehouse.items.find(element => element.itemId.id === item.id)

    if (warehouseItem) {
      res.status(403).send('Error: Item already exists in this warehouse, to add stock use PUT instead')
    } else {
      warehouse.items.push({
        itemId: item.id,
        quantityAvailable: req.body.quantityAvailable,
        totalQuantity: req.body.quantityAvailable
      })
      warehouse.save()
      item.qtyAvailable = item.qtyAvailable + req.body.quantityAvailable
      item.qtyTotal = item.qtyTotal + req.body.quantityAvailable
      item.save()
      res.status(200).send(`Success: Added ${req.body.quantityAvailable} units of ${item.name} to ${warehouse.name}`)
    }
  } catch (error) {
    next(error)
  }
}

// updateWarehouseStock - Sólo para actualizar qtyTotal y automaticamente añade esa misma cantidad al available. No actualiza de forma directa, hace cálculo con la cantidad indicada (qtyTotal = qtyTotal + req.body.qtyTotal) : Sólo admin

// deleteWarehouseItem - Sólo cuando no hay stock en qtyTotal : Sólo admin

module.exports = {
  createWarehouse,
  getWarehouses,
  getWarehouse,
  updateWarehouse,
  deleteWarehouse,
  addWarehouseItem
}
