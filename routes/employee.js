const express = require('express')
const controller = require('../controllers/employee')
const router = express.Router()
const {checkPermission} = require('../controllers/auth')


router.post('/data', checkPermission(), controller.getEmployeeDataById)
router.post('/workplace', checkPermission(['Admin']), controller.createEmployeeWorkplace)
router.post('/workplaces', checkPermission(['Admin']), controller.createEmployeeWorkplaces)
router.delete('/workplace', checkPermission(['Admin']), controller.deleteEmployeeWorkplace)
router.post('/', checkPermission(['Admin']), controller.createEmployee)
router.post('/update', checkPermission(['Admin']), controller.updateEmployee)
router.get('/payment-list', checkPermission(), controller.getPaymentList)
router.post('/payment-list', checkPermission(['Admin']), controller.createPaymentList)

router.post('/work-schedule', checkPermission(['Admin']), controller.updateWorkSchedule)

router.post('/tabel', checkPermission(['Admin']), controller.updatEemployeeTabel)
router.get('/tabel', checkPermission(), controller.getEmployeeTabel)

router.post('/personal-work-schedules-data', checkPermission(['Admin']), controller.createPersonalWorkSchedulesData)

router.post('/types-of-employment', checkPermission(['Admin']), controller.createTypesOfEmployment)

router.post('/employee-work-schedules-data', checkPermission(['Admin']), controller.createEmployeeWorkSchedulesData)

router.get('/employee-work-schedules-data-for-period', checkPermission(), controller.getEmployeeWorkSchedulesDataForPeriod)

module.exports = router