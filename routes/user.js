const express = require('express')
const passport = require('passport')
const controller = require('../controllers/user')
const router = express.Router()

router.post('/info', passport.authenticate('jwt', {session: false}), controller.getUserInfoById)
router.post('/', passport.authenticate('jwt', {session: false}), controller.createUser)
router.put('/', passport.authenticate('jwt', {session: false}), controller.updateUser)
router.delete('/', passport.authenticate('jwt', {session: false}), controller.deleteUser)

module.exports = router