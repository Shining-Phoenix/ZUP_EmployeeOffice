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

router.post('/work-schedule', passport.authenticate('jwt', {session: false}), controller.updateWorkSchedule)

router.post('/tabel', passport.authenticate('jwt', {session: false}), controller.updatEemployeeTabel)
router.get('/tabel', passport.authenticate('jwt', {session: false}), controller.getEmployeeTabel)

router.post('/personal-work-schedules-data', passport.authenticate('jwt', {session: false}), controller.createPersonalWorkSchedulesData)

router.post('/employee-work-schedules-data', passport.authenticate('jwt', {session: false}), controller.createEmployeeWorkSchedulesData)

router.get('/employee-work-schedules-data-for-period', passport.authenticate('jwt', {session: false}), controller.getEmployeeWorkSchedulesDataForPeriod)

module.exports = router