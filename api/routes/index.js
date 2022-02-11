const router = require('express').Router()
const authRouter = require('./auth.router')
const userRouter = require('./user.router')
const eventRouter = require('./event.router')
const locationRouter = require('./location.router')
const itemRouter = require('./item.router')

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/events', eventRouter)
router.use('/location', locationRouter)
router.use('/items', itemRouter)
// router.use('/inventory', inventoryRouter)

module.exports = router
