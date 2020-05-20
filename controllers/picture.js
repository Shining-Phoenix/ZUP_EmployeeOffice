const errorHandler = require('../utils/errorHandler')
const user = require('../models/user')
const fs = require('fs');

module.exports.create = async (req, res) => {

    const userId1c = req.body.userId1c
    const path = req.file && req.file.path || ''

    try {
        await user.updateMainFoto(userId1c, path)
        res.status(201).json({message: 'Picture added'})
    } catch (e) {
        fs.unlinkSync(req.file.path)
        errorHandler(res, e)
        throw e
    }

}