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
    const item = warehouse.items.filter(element => {
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
          warehouse.items[itemIndex].qtyAvailable = warehouse.items[itemIndex].qtyAvailable + req.body.quantity
          warehouse.items[itemIndex].qtyBooked = warehouse.items[itemIndex].qtyBooked - req.body.quantity
          break
        case 'incident':
          warehouse.items[itemIndex].qtyAvailable = warehouse.items[itemIndex].qtyAvailable + req.body.quantity
          warehouse.items[itemIndex].qtyDefect = warehouse.items[itemIndex].qtyDefect - req.body.quantity
          break
        case 'stock':
          warehouse.items[itemIndex].qtyAvailable = warehouse.items[itemIndex].qtyAvailable + req.body.quantity
          warehouse.items[itemIndex].qtyTotal = warehouse.items[itemIndex].qtyTotal + req.body.quantity
          break
      }
    } else if (req.body.movementType === 'out') {
      switch (req.body.source) {
        case 'booking':
          warehouse.items[itemIndex].qtyAvailable = warehouse.items[itemIndex].qtyAvailable - req.body.quantity
          warehouse.items[itemIndex].qtyBooked = warehouse.items[itemIndex].qtyBooked + req.body.quantity
          break
        case 'incident':
          warehouse.items[itemIndex].qtyAvailable = warehouse.items[itemIndex].qtyAvailable - req.body.quantity
          warehouse.items[itemIndex].qtyDefect = warehouse.items[itemIndex].qtyDefect + req.body.quantity
          break
        case 'stock':
          warehouse.items[itemIndex].qtyAvailable = warehouse.items[itemIndex].qtyAvailable - req.body.quantity
          warehouse.items[itemIndex].qtyTotal = warehouse.items[itemIndex].qtyTotal - req.body.quantity
          break
      }
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  updateOneStock
}
