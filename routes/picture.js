const express = require('express')
const controller = require('../controllers/picture')
const router = express.Router()
const upload = require('../middleware/upload')

router.post('/', upload.single('image'), controller.createImage)

module.exports = router