const errorHandler = require('../utils/errorHandler')
const exchange = require('../models/exchange')

module.exports.getObjects = async function(req, res) {
    try {
        const Data = await exchange.getObjects(req.query)
        res.status(200).json(Data)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.confirmObjects = async function(req, res) {
    try {
        const userData = await exchange.confirmObjects(req.body)
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}