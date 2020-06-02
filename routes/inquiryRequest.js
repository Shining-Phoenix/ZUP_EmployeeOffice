const express = require('express')
const passport = require('passport')
const controller = require('../controllers/inquiryRequest')
const router = express.Router()

router.get('/by-user', passport.authenticate('jwt', {session: false}), controller.getInquiryRequestByUser)

router.get('/by-id', passport.authenticate('jwt', {session: false}), controller.getInquiryRequestById)
router.put('/by-id', passport.authenticate('jwt', {session: false}), controller.updateInquiryRequestById)
router.post('/', passport.authenticate('jwt', {session: false}), controller.createInquiryRequest)
router.patch('/', passport.authenticate('jwt', {session: false}), controller.patchInquiryRequest)

router.get('/statuses', passport.authenticate('jwt', {session: false}), controller.getInquiryRequestStatuses)
router.get('/types', passport.authenticate('jwt', {session: false}), controller.getInquiryRequestTypes)

module.exports = router