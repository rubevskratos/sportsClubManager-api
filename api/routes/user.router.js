const router = require('express').Router()
const {
  checkAuth,
  checkAdmin
} = require('../utils')

const {
  getAllUsers,
  getUser,
  updatetUser,
  deleteUser,
  getUserMaterials,
  getUserEvents,
  getOwnUser,
  getOwnUserMaterials,
  getOwnUserEvents,
  updateOwnUser,
  deleteOwnUser,
  returnOneUserItem
} = require('../controllers/user.controller')

const {
  returnOneEventItem
} = require('../controllers/event.controller')

const {
  updateOneStock
} = require('../controllers/inventory.controller')

router.get('/', checkAuth, getAllUsers)

router.get('/profile/events', checkAuth, getOwnUserEvents)
router.get('/profile/materials', checkAuth, getOwnUserMaterials)
// router.put('/profile/materials/return', checkAuth, returnAllUserItems)
router.put('/profile/materials/return/:itemId', checkAuth, returnOneUserItem, returnOneEventItem, updateOneStock)
router.get('/profile', checkAuth, getOwnUser)
router.put('/profile', checkAuth, updateOwnUser)
router.delete('/profile', checkAuth, deleteOwnUser)

router.get('/:id/events', checkAuth, getUserEvents)
router.get('/:id/materials', checkAuth, getUserMaterials)
router.get('/:id', checkAuth, getUser)
router.put('/:id', checkAuth, checkAdmin, updatetUser)
router.delete('/:id', checkAuth, checkAdmin, deleteUser)

/*
// user.router
    // returnAllUserItems -- tipo de movimiento: in, origen: user, lista de items con cantidades y id del warehouse
      // esta opción devolverá TODOS los materiales con estado "In Use", y no te permitirá devolver ninguna otra cantidad que no sea el total. Además eliminará todos los materiales de la lista del usuario.
      // esta opción además actualizará todos los eventos a los que hagan referencia esos materiales, actualizará el campo qtyReturned de los items que tiene este usuario en el evento, además marcará el estado "returned".
      // utilizará el inventory middleware para actualizar el almacén
    // returnOneUserItem -- tipo de movimiento: in, origen: user, un sólo item con cantidad y id del warehouse.
      // esta opción además actualizará el evento al que hace referencia el item, cambiará el campo qtyReturned y en caso de que éste sea igual al qtyBooked cambiará el estado a "Returned"
      // utilizará el inventory middleware para actualizar el almacén
*/

module.exports = router
