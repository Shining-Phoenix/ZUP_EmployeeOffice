const errorHandler = require('../utils/errorHandler')
const user = require('../models/user')

module.exports.getUserInfoById = async function(req, res) {
    try {
        const userData = await user.getUserInfoById(req.user.pk)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createUser = async function(req, res) {
    try {
        const userData = await user.createUser(req.body)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.updateUser = async function(req, res) {
    try {
        const userData = await user.updateUser(req.boby)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.deleteUser = async function(req, res) {
    try {
        const userData = await user.deleteUser(req.boby)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}


