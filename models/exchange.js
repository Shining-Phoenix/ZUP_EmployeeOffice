const db = require('../shared/pgdb')

module.exports.getObjects = async (params) => {

    const client = await db.client()

    try {
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
        return {data: rows}
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

        console.log(arrayOfObjects)

        for (exObject of arrayOfObjects) {

            const sql = `
                UPDATE
                    exchange 
                SET
                    confirmed = true                    
                WHERE
                    pk = $1`

            await db.query(sql, [exObject.pk])

            await client.query('COMMIT')
            client.release()
        }


    } catch (e) {
        console.log(e)
        await client.query('ROOLBACK')
        client.release()
        throw e}
}

