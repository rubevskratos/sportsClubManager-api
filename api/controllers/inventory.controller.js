const Warehouses = require('../models/warehouse.model')

async function updateOneStock (req, res, next) {
  try {
    const warehouse = await Warehouses.findById(req.body.warehouseId)
      .populate({
        path: 'items',
        populate: {
          path: 'itemId',
          model: 'item'
        }
      })
    const item = warehouse.items.find(element => {
      if (element.itemId.id === req.params.itemId) {
        return true
      } else {
        return false
      }
    })

    const itemIndex = warehouse.items.indexOf(item)

    if (req.body.movementType === 'in') {
      switch (req.body.source) {
        case 'return':
          warehouse.items[itemIndex].quantityAvailable = warehouse.items[itemIndex].quantityAvailable + req.body.quantity
          warehouse.items[itemIndex].quantityBooked = warehouse.items[itemIndex].quantityBooked - req.body.quantity
          break
        case 'incident':
          warehouse.items[itemIndex].quantityAvailable = warehouse.items[itemIndex].quantityAvailable + req.body.quantity
          warehouse.items[itemIndex].quantityDefect = warehouse.items[itemIndex].quantityDefect - req.body.quantity
          break
        case 'stock':
          warehouse.items[itemIndex].quantityAvailable = warehouse.items[itemIndex].quantityAvailable + req.body.quantity
          warehouse.items[itemIndex].totalQuantity = warehouse.items[itemIndex].totalQuantity + req.body.quantity
          break
      }
    } else if (req.body.movementType === 'out') {
      switch (req.body.source) {
        case 'booking':
          warehouse.items[itemIndex].quantityAvailable = warehouse.items[itemIndex].quantityAvailable - req.body.quantity
          warehouse.items[itemIndex].quantityBooked = warehouse.items[itemIndex].quantityBooked + req.body.quantity
          break
        case 'incident':
          warehouse.items[itemIndex].quantityAvailable = warehouse.items[itemIndex].quantityAvailable - req.body.quantity
          warehouse.items[itemIndex].quantityDefect = warehouse.items[itemIndex].quantityDefect + req.body.quantity
          break
        case 'stock':
          if (req.body.quantity < 0) { req.body.quantity = req.body.quantity * -1 }
          warehouse.items[itemIndex].quantityAvailable = warehouse.items[itemIndex].quantityAvailable - req.body.quantity
          warehouse.items[itemIndex].totalQuantity = warehouse.items[itemIndex].totalQuantity - req.body.quantity
          break
      }
    }
    warehouse.save()
    res.status(200).send('Success: Inventory updated.')
  } catch (error) {
    next(error)
  }
}

async function updateStock (req, res, next) {
  try {
    const items = res.inventoryData
    for (let i = 0; i < items.length; i++) {
      const element = items[i]
      const warehouse = await Warehouses.findById(element.warehouseId)
        .populate({
          path: 'items',
          populate: {
            path: 'itemId',
            model: 'item'
          }
        })

      const item = warehouse.items.find(el => {
        if (el.itemId.id === element.itemId) {
          return true
        } else {
          return false
        }
      })

      const itemIndex = warehouse.items.indexOf(item)
      console.log(itemIndex)
      if (element.movementType === 'in') {
        switch (element.source) {
          case 'return':
            warehouse.items[itemIndex].quantityAvailable = warehouse.items[itemIndex].quantityAvailable + element.quantity
            warehouse.items[itemIndex].quantityBooked = warehouse.items[itemIndex].quantityBooked - element.quantity
            break
          case 'incident':
            warehouse.items[itemIndex].quantityAvailable = warehouse.items[itemIndex].quantityAvailable + element.quantity
            warehouse.items[itemIndex].quantityDefect = warehouse.items[itemIndex].quantityDefect - element.quantity
            break
          case 'stock':
            warehouse.items[itemIndex].quantityAvailable = warehouse.items[itemIndex].quantityAvailable + element.quantity
            warehouse.items[itemIndex].totalQuantity = warehouse.items[itemIndex].totalQuantity + element.quantity
            break
        }
      } else if (element.movementType === 'out') {
        switch (element.source) {
          case 'booking':
            warehouse.items[itemIndex].quantityAvailable = warehouse.items[itemIndex].quantityAvailable - element.quantity
            warehouse.items[itemIndex].quantityBooked = warehouse.items[itemIndex].quantityBooked + element.quantity
            break
          case 'incident':
            warehouse.items[itemIndex].quantityAvailable = warehouse.items[itemIndex].quantityAvailable - element.quantity
            warehouse.items[itemIndex].quantityDefect = warehouse.items[itemIndex].quantityDefect + element.quantity
            break
          case 'stock':
            warehouse.items[itemIndex].quantityAvailable = warehouse.items[itemIndex].quantityAvailable - element.quantity
            warehouse.items[itemIndex].totalQuantity = warehouse.items[itemIndex].totalQuantity - element.quantity
            break
        }
      }
      await warehouse.save()
    }
    res.status(200).send('Success: Inventory updated')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  updateOneStock,
  updateStock
}
