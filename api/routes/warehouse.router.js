const router = require('express').Router()

const {
  checkAuth,
  checkAdmin,
  checkRole
} = require('../utils')

const {
  updateOneStock
} = require('../controllers/inventory.controller')

const {
  createWarehouse,
  getWarehouses,
  getWarehouse,
  updateWarehouse,
  deleteWarehouse,
  addWarehouseItem,
  updateWarehouseStock,
  deleteWarehouseItem
} = require('../controllers/warehouse.controller')

router.post('/', checkAuth, checkAdmin, createWarehouse)
router.get('/', checkAuth, checkRole, getWarehouses)
router.post('/:id/items/:itemId', checkAuth, checkAdmin, addWarehouseItem)
router.put('/:id/items/:itemId', checkAuth, checkAdmin, updateWarehouseStock, updateOneStock)
router.delete('/:id/items/:itemId', checkAuth, checkAdmin, deleteWarehouseItem)
router.get('/:id', checkAuth, checkRole, getWarehouse)
router.put('/:id', checkAuth, checkAdmin, updateWarehouse)
router.delete('/:id', checkAuth, checkAdmin, deleteWarehouse)

module.exports = router
