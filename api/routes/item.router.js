const router = require('express').Router()

const {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deletItem
} = require('../controllers/item.controller')

const {
  checkAuth,
  checkAdmin
} = require('../utils')

router.get('/', checkAuth, getAllItems)
router.post('/', checkAuth, checkAdmin, createItem)
router.get('/:id', checkAuth, getItem)
router.put('/:id', checkAuth, checkAdmin, updateItem)
router.delete('/:id', checkAuth, checkAdmin, deletItem)

module.exports = router
