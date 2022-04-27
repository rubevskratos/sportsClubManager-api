const router = require('express').Router()
const authRouter = require('./auth.router')
const userRouter = require('./user.router')
const eventRouter = require('./event.router')
const locationRouter = require('./location.router')
const itemRouter = require('./item.router')
const warehouseRouter = require('./warehouse.router')

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/events', eventRouter)
router.use('/locations', locationRouter)
router.use('/items', itemRouter)
router.use('/warehouses', warehouseRouter)

module.exports = router
