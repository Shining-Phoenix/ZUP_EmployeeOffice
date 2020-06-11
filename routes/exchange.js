const express = require('express')
const {checkPermission} = require('../controllers/auth')
const controller = require('../controllers/exchange')
const router = express.Router()

router.get('/', checkPermission(['Admin']), controller.getObjects)
router.post('/', checkPermission(['Admin']), controller.confirmObjects)

module.exports = router