const express = require('express')
const passport = require('passport')
const controller = require('../controllers/common')
const {checkPermission} = require('../controllers/auth')
const router = express.Router()

router.post('/organisation', checkPermission(['Admin']), controller.addOrUpdateOrganisation)

router.post('/subdivision', checkPermission(['Admin']), controller.addOrUpdateSubdivision)

router.post('/employee-position', checkPermission(['Admin']), controller.createEmployeePosition)
router.put('/employee-position', checkPermission(['Admin']), controller.updateEmployeePosition)
router.delete('/employee-position', checkPermission(), controller.deleteEmployeePosition)

router.get('/type-of-time', checkPermission(), controller.getTypeOfTime)
router.post('/type-of-time', checkPermission(['Admin']), controller.createTypeOfTime)
router.patch('/type-of-time', checkPermission(['Admin']), controller.updateTypeOfTime)

router.post('/inquiry-request-type', checkPermission(['Admin']), controller.createInquiryRequestType)

router.post('/work-schedule', checkPermission(['Admin']), controller.createWorkSchedule)
router.patch('/work-schedule', checkPermission(['Admin']), controller.updateWorkSchedule)

router.post('/general-work-schedules-data', checkPermission(['Admin']), controller.createGeneralWorkSchedulesData)


module.exports = router