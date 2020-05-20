const express = require('express')
const passport = require('passport')
const controller = require('../controllers/common')
const router = express.Router()

router.post('/organisation', passport.authenticate('jwt', {session: false}), controller.addOrUpdateOrganisation)
router.post('/subdivision', passport.authenticate('jwt', {session: false}), controller.addOrUpdateSubdivision)
router.post('/employee-position', passport.authenticate('jwt', {session: false}), controller.createEmployeePosition)
router.put('/employee-position', passport.authenticate('jwt', {session: false}), controller.updateEmployeePosition)
router.delete('/employee-position', passport.authenticate('jwt', {session: false}), controller.deleteEmployeePosition)


module.exports = router