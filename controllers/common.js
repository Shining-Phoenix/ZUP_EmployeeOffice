const errorHandler = require('../utils/errorHandler')
const common = require('../models/common')

module.exports.addOrUpdateOrganisation = async function(req, res) {
    try {
        const userData = await common.addOrUpdateOrganisation(req.body)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.addOrUpdateSubdivision = async function(req, res) {
    try {
        const userData = await common.addOrUpdateSubdivision(req.body)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createEmployeePosition = async function(req, res) {
    try {
        const userData = await common.createEmployeePosition(req.body)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateEmployeePosition = async function(req, res) {
    try {
        const userData = await common.updateEmployeePosition(req.body)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.deleteEmployeePosition = async function(req, res) {
    try {
        const userData = await common.deleteEmployeePosition(req.body)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
    }
}
