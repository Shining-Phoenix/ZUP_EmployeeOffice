const express = require('express')
const {checkPermission} = require('../controllers/auth')
const controller = require('../controllers/inquiryRequest')
const router = express.Router()

router.get('/by-user', checkPermission(), controller.getInquiryRequestByUser)

router.get('/by-id', checkPermission(), controller.getInquiryRequestById)
router.put('/by-id', checkPermission(), controller.updateInquiryRequestById)
router.post('/', checkPermission(), controller.createInquiryRequest)
router.patch('/', checkPermission(), controller.patchInquiryRequest)

router.get('/statuses', checkPermission(), controller.getInquiryRequestStatuses)
router.get('/types', checkPermission(), controller.getInquiryRequestTypes)

module.exports = router