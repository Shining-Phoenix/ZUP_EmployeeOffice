const errorHandler = require('../utils/errorHandler')
const inquiryRequest = require('../models/inquiryRequest')

module.exports.getInquiryRequestStatuses = async function(req, res) {
    try {
        const data = await inquiryRequest.getInquiryRequestStatuses(req.body)
        res.status(200).json(data)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.getInquiryRequestTypes = async function(req, res) {
    try {
        const data = await inquiryRequest.getInquiryRequestTypes(req.query.basePk)
        res.status(200).json(data)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.getInquiryRequestByUser = async function(req, res) {
    try {
        const data = await inquiryRequest.getInquiryRequestByUser(req.query.pk)
        res.status(200).json(data)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.getInquiryRequestById = async function(req, res) {
    try {
        const data = await inquiryRequest.getInquiryRequestById(req.query.id)
        res.status(200).json(data)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.updateInquiryRequestById = async function(req, res) {
    try {
        const userData = await inquiryRequest.updateInquiryRequestById(req.body)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.createInquiryRequest = async function(req, res) {
    try {
        const userData = await inquiryRequest.createInquiryRequest(req.body)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.deletyInquiryRequest = async function(req, res) {
    // try {
    //     const userData = await employee.createEmployeeWorkplace(req.body)
    //     res.status(200).json(userData)
    // } catch (e) {
    //     errorHandler(res, e)
    //     throw e
    // }
}
