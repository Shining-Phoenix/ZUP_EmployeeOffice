const express = require('express')
const passport = require('passport')
const controller = require('../controllers/common')
const router = express.Router()

router.post('/organisation', passport.authenticate('jwt', {session: false}), controller.addOrUpdateOrganisation)

router.post('/subdivision', passport.authenticate('jwt', {session: false}), controller.addOrUpdateSubdivision)

router.post('/employee-position', passport.authenticate('jwt', {session: false}), controller.createEmployeePosition)
router.put('/employee-position', passport.authenticate('jwt', {session: false}), controller.updateEmployeePosition)
router.delete('/employee-position', passport.authenticate('jwt', {session: false}), controller.deleteEmployeePosition)

router.get('/type-of-time', passport.authenticate('jwt', {session: false}), controller.getTypeOfTime)
router.post('/type-of-time', passport.authenticate('jwt', {session: false}), controller.createTypeOfTime)
router.patch('/type-of-time', passport.authenticate('jwt', {session: false}), controller.updateTypeOfTime)

router.post('/inquiry-request-type', passport.authenticate('jwt', {session: false}), controller.createInquiryRequestType)

router.post('/work-schedule', passport.authenticate('jwt', {session: false}), controller.createWorkSchedule)
router.patch('/work-schedule', passport.authenticate('jwt', {session: false}), controller.updateWorkSchedule)

router.post('/general-work-schedules-data', passport.authenticate('jwt', {session: false}), controller.createGeneralWorkSchedulesData)


module.exports = router