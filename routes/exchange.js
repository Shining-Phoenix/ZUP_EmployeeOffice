const express = require('express')
const passport = require('passport')
const controller = require('../controllers/exchange')
const router = express.Router()

router.get('/', passport.authenticate('jwt', {session: false}), controller.getObjects)
router.post('/', passport.authenticate('jwt', {session: false}), controller.confirmObjects)

module.exports = router