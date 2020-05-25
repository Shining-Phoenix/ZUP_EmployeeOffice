const express = require('express')
const passport = require('passport')
const controller = require('../controllers/employee')
const router = express.Router()

router.post('/data', passport.authenticate('jwt', {session: false}), controller.getEmployeeDataById)
router.post('/workplace', passport.authenticate('jwt', {session: false}), controller.createEmployeeWorkplace)
router.post('/workplaces', passport.authenticate('jwt', {session: false}), controller.createEmployeeWorkplaces)
router.delete('/workplace', passport.authenticate('jwt', {session: false}), controller.deleteEmployeeWorkplace)
router.post('/', passport.authenticate('jwt', {session: false}), controller.createEmployee)
router.get('/payment-list', passport.authenticate('jwt', {session: false}), controller.getPaymentList)
router.post('/payment-list', passport.authenticate('jwt', {session: false}), controller.createPaymentList)

module.exports = router