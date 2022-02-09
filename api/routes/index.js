const router = require('express').Router()
const authRouter = require('./auth.router')
const userRouter = require('./user.router')
const eventRouter = require('./event.router')

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/event', eventRouter)
//router.use('/item', itemRouter)
//router.use('/inventory', inventoryRouter)

module.exports = router
