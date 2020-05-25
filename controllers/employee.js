const errorHandler = require('../utils/errorHandler')
const employee = require('../models/employee')

module.exports.getEmployeeDataById = async function(req, res) {
    try {
        const userData = await employee.getUserInfoById(req.user.pk)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createEmployeeWorkplace = async function(req, res) {
    try {
        const userData = await employee.createEmployeeWorkplace(req.body)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.createEmployeeWorkplaces = async function(req, res) {
    try {
        const userData = await employee.createEmployeeWorkplaces(req.body)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.deleteEmployeeWorkplace = async function(req, res) {
    try {
        const userData = await employee.deleteEmployeeWorkplace(req.body)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.createEmployee = async function(req, res) {
    try {
        const userData = await employee.createEmployee(req.body)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.getPaymentList = async function(req, res) {
    try {
        const userData = await employee.getPaymentList(req.query)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.createPaymentList = async function(req, res) {
    try {
        const userData = await employee.createPaymentList(req.body)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}
