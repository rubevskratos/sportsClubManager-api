const router = require('express').Router()
const authRouter = require('./auth.router')
const userRouter = require('./user.router')

router.use('/auth', authRouter)
router.use('/users', userRouter)
//router.use('/item', itemRouter)
//router.use('/event', eventRouter)
//router.use('/inventory', inventoryRouter)

module.exports = router
