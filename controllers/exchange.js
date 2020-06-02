const errorHandler = require('../utils/errorHandler')
const db = require('../shared/pgdb')

module.exports.getObjects = async function (req, res) {

    const client = await db.client()

    try {
        const params = req.query

        const sql = `
            SELECT 
                *
            FROM 
                exchange
            WHERE
                base_pk = $1 
                AND confirmed = false
            
                `
        const {rows} = await client.query(sql, [+params.base_pk])

        for (exObject of rows) {
            if (exObject.ex_type === 'InquiryRequest') {
                const updateSql = `
                    UPDATE
                        inquiry_request
                    SET
                        status_pk = 2
                    WHERE
                        pk = $1`

                const tempObj = JSON.parse(exObject.ex_data)
                await client.query(updateSql, [tempObj.pk])
            }
        }

        await client.query('COMMIT')
        client.release()
        const Data = {data: rows}

        res.status(200).json(Data)
    } catch (e) {
        errorHandler(res, e)
        await client.query('ROOLBACK')
        client.release()
        throw e
    }
}

module.exports.confirmObjects = async function (req, res) {
    const client = await db.client()
    try {
        const arrayOfObjects = req.body
        await client.query('BEGIN')

        for (exObject of arrayOfObjects) {
            const sql = `
                UPDATE
                    exchange 
                SET
                    confirmed = true                    
                WHERE
                    pk = $1`
            await db.query(sql, [exObject.pk])
        }

        await client.query('COMMIT')
        client.release()

        res.status(200).json({'massage': 'confirmed'})
    } catch (e) {
        errorHandler(res, e)
        await client.query('ROOLBACK')
        client.release()
        throw e
    }
}