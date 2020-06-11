const errorHandler = require('../utils/errorHandler')
const fs = require('fs');
const db = require('../shared/pgdb')

module.exports.createImage = async (req, res) => {
    const userId1c = req.body.userId1c
    const path = req.file && req.file.path || ''

    try {
        const sql = `UPDATE users SET image_src = $1 where id_1c = $2 RETURNING pk`
        await db.query(sql, [path, userId1c]);

        res.status(201).json({message: 'Picture added'})
    } catch (e) {
        fs.unlinkSync(req.file.path)
        errorHandler(res, e)
        throw e
    }
}