const Warehouses = require('../models/warehouse.model')
const Users = require('../models/user.model')
const Items = require('../models/item.model')
const Events = require('../models/event.model')

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

async function updateWarehouseStock (req, res, next) {
  try {
    const warehouse = await Warehouses.findById(req.params.id)
      .populate({
        path: 'items',
        populate: {
          path: 'itemId',
          model: 'item'
        }
      })
    const item = warehouse.items.find(e => e.itemId.id === req.params.itemId)

    if (!item) {
      res.status(400).send('Error: item not found in this warehouse')
    } else if (!req.body.quantity) {
      res.status(500).send('Error: debes especificar una cantidad a actualizar.')
    } else if (Number.isInteger(req.body.quantity) === false) {
      res.status(500).send('Error: debes utilizar unidades enteras')
    } else {
      if (req.body.quantity < 0) {
        const checkAvailable = item.quantityAvailable + req.body.quantity >= 0
        if (checkAvailable) {
          req.body.warehouseId = warehouse.id
          req.body.source = 'stock'
          req.body.movementType = 'out'
          req.body.quantity = req.body.quantity * -1
          next()
        } else {
          res.status(500).send(`Error: Can't remove more than available, current available is ${item.quantityAvailable}`)
        }
      } else {
        req.body.warehouseId = warehouse.id
        req.body.source = 'stock'
        req.body.movementType = 'in'
        next()
      }
    }
  } catch (error) {
    next(error)
  }
}

async function deleteWarehouseItem (req, res, next) {
  try {
    const warehouse = await Warehouses.findById(req.params.id)
      .populate({
        path: 'items',
        populate: {
          path: 'itemId',
          model: 'item'
        }
      })
    const item = warehouse.items.find(e => e.itemId.id === req.params.itemId)

    if (!item) {
      res.status(400).send('Error: Item not found in warehouse')
    } else {
      const events = await Events.find()
      let checkUsed = 0
      for (let i = 0; i < events.length; i++) {
        const event = events[i]
        await event.populate({ path: 'materials', populate: { path: 'item', model: 'item' } })
        await event.populate({ path: 'materials', populate: { path: 'warehouse', model: 'warehouse' } })
        const checkExists = event.materials.find(e => e.item.id === req.params.itemId && e.warehouse.id === req.params.id)
        if (checkExists) {
          checkUsed = 1
          i = events.length
        }
      }
      if (item.totalQuantity !== 0) {
        res.status(500).send('Error: cannot remove an item with stock, please first remove any stock')
      } else if (checkUsed) {
        res.status(500).send('Error: cannot remove an item that has been used in an event for traceability purposes.')
      } else {
        warehouse.items = warehouse.items.filter(e => e.itemId.id !== req.params.itemId)
        warehouse.save()
        res.status(200).send('Success: Item has been successfully removed')
      }
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
  deleteWarehouse,
  addWarehouseItem,
  updateWarehouseStock,
  deleteWarehouseItem
}
