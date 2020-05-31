const db = require('../shared/pgdb')

module.exports.getObjects = async () => {

    const client = await db.client()

    try {
        const sql = `
            SELECT *
            FROM exchange
                `
        const {rows} = await client.query(sql)

        for (exObject of rows){
            if (exObject.ex_type === 'InquiryRequest'){
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
        return rows
    } catch (e) {
        console.log(e)
        await client.query('ROOLBACK')
        client.release()
        throw e}
}

module.exports.confirmObjects = async (arrayOfObjects) => {

    const client = await db.client()

    try {
        await client.query('BEGIN')

        for (exObject of arrayOfObjects) {

            const sql = `
                DELETE 
                FROM 
                    exchange
                WHERE
                    pk = $1`
            const {rows} = await db.query(sql, [exObject.pk])

            await client.query('COMMIT')
            client.release()
        }


    } catch (e) {
        console.log(e)
        await client.query('ROOLBACK')
        client.release()
        throw e}
}

