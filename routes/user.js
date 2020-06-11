const express = require('express')
const {checkPermission} = require('../controllers/auth')
const controller = require('../controllers/user')
const router = express.Router()

router.post('/info', checkPermission(), controller.getUserInfoById)
router.post('/', checkPermission(['Admin']), controller.createUser)
router.put('/', checkPermission(['Admin']), controller.updateUser)
router.delete('/', checkPermission(['Admin']), controller.deleteUser)

module.exports = router