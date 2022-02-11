const router = require('express').Router()

const {
  checkAuth,
  checkAdmin,
  checkRole
} = require('../utils')

const {
  createWarehouse,
  getWarehouses,
  getWarehouse,
  updateWarehouse,
  deleteWarehouse
} = require('../controllers/warehouse.controller')

router.post('/', checkAuth, checkAdmin, createWarehouse)
router.get('/', checkAuth, checkRole, getWarehouses)
router.get('/:id', checkAuth, checkRole, getWarehouse)
router.put('/:id', checkAuth, checkAdmin, updateWarehouse)
router.delete('/:id', checkAuth, checkAdmin, deleteWarehouse)

module.exports = router
