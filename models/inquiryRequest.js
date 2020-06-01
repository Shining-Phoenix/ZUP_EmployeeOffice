const db = require('../shared/pgdb')

module.exports.getInquiryRequestByUser = async (pk) => {

    const sql = `
        SELECT
            inquiry_request.pk,
            inquiry_request.deleted,
            inquiry_request.doc_number,
            inquiry_request.doc_date,
            to_char(inquiry_request.doc_date,'DD.MM.YYYY HH24:MI:SS') as doc_date_str,
            inquiry_request.description,  
            inquiry_request.user_pk,
            inquiry_request.status_pk,
            inquiry_request.type_pk,
            inquiry_request_status.status,
            inquiry_request_type.type_name,
            inquiry_request_status.disabled_on_web
        FROM
            inquiry_request 
                INNER JOIN inquiry_request_status on (inquiry_request.status_pk = inquiry_request_status.pk)  
                INNER JOIN inquiry_request_type on (inquiry_request.type_pk = inquiry_request_type.pk)
        WHERE    
            inquiry_request.user_pk = $1
        ORDER BY  
            inquiry_request.doc_date desc`

    const {rows} = await db.query(sql, [+pk])

    return rows
}

module.exports.getInquiryRequestStatuses = async () => {

    const sql = `
        SELECT 
            pk,
            status
        FROM
            inquiry_request_status`

    const {rows} = await db.query(sql);

    return rows

}

module.exports.getInquiryRequestTypes = async (base_pk) => {

    const sql = `
        SELECT 
            pk,
            type_name
        FROM
            inquiry_request_type
        WHERE
            base_pk = $1`
    const {rows} = await db.query(sql, [base_pk]);
    return rows

}

module.exports.getInquiryRequestById = async (id) => {

    const sql = `
        SELECT
            inquiry_request.pk,
            inquiry_request.deleted,
            inquiry_request.doc_number,
            inquiry_request.doc_date,
            to_char(inquiry_request.doc_date,'DD.MM.YYYY HH24:MI:SS') as doc_date_str,
            inquiry_request.description,  
            inquiry_request.user_pk,
            inquiry_request.status_pk,
            inquiry_request.type_pk,
            inquiry_request_status.status,
            inquiry_request_type.type_name,
            inquiry_request_status.disabled_on_web
        FROM
            inquiry_request 
                INNER JOIN inquiry_request_status on (inquiry_request.status_pk = inquiry_request_status.pk)  
                INNER JOIN inquiry_request_type on (inquiry_request.type_pk = inquiry_request_type.pk)
        WHERE    
            inquiry_request.pk = $1`

    const {rows} = await db.query(sql, [id])

    if (rows.length) {
        return rows[0]
    }
    return {}
}

module.exports.updateInquiryRequestById = async (inquiryRequest) => {

    const client = await db.client()

    try {
        await client.query('BEGIN')

        const selectSql = `
        SELECT 
                users.base_pk
            FROM 
                inquiry_request 
                    INNER JOIN users on(inquiry_request.user_pk = users.pk)        
            WHERE    
                inquiry_request.pk = $1`

        const selectRows = await client.query({
                rowMode: 'array',
                text : selectSql}, [inquiryRequest.pk])

        const basePk = selectRows.rows[0][0]

        const doc_date = new Date(inquiryRequest.doc_date)

        const sql = `
            UPDATE 
                inquiry_request
            SET
                doc_date = $1,   
                status_pk = $2, 
                type_pk = $3, 
                doc_number = $4,
                description = $5,
                deleted = $6                          
            WHERE    
                pk = $7
            RETURNING 
                pk`
        const {rows} = await client.query(sql, [
            doc_date,
            inquiryRequest.status_pk,
            inquiryRequest.type_pk,
            inquiryRequest.doc_number,
            inquiryRequest.description,
            inquiryRequest.deleted,
            inquiryRequest.pk
        ])


        const pk = rows[0].pk

        const typeSql = `
        SELECT
            id_1c
        FROM 
            inquiry_request_type
        WHERE 
            pk = $1`

        const resultType = await client.query(typeSql, [inquiryRequest.type_pk])
        const id_1c = resultType.rows[0].id_1c
        inquiryRequest.type_id_1c = id_1c

        const exchangeSQL = `
        INSERT INTO
            exchange(
            ex_type,
            ex_data,
            event_pk,
            ex_date, 
            base_pk
            )
        VALUES
            ($1, $2, $3, $4, $5)`

        inquiryRequest.pk = pk

        await client.query(exchangeSQL, [
            'InquiryRequest',
            JSON.stringify(inquiryRequest),
            2,
            new Date,
            basePk])

        await client.query('COMMIT')
        client.release()

        return pk

    } catch (e) {
        console.log(e)
        await client.query('ROOLBACK')
        client.release()
        throw e}
}

module.exports.createInquiryRequest = async (inquiryRequest) => {

    const client = await db.client()

    try {
        await client.query('BEGIN')

        const doc_date = new Date(inquiryRequest.doc_date)

        const sql = `
        INSERT INTO 
            inquiry_request (doc_date,
                user_pk,   
                status_pk, 
                type_pk, 
                doc_number,
                description,
                deleted) 
        VALUES
            ($1, $2, $3, $4, $5, $6, $7)
        RETURNING 
            pk`

        const {rows} = await client.query(sql, [
            doc_date,
            inquiryRequest.user_pk,
            inquiryRequest.status_pk,
            inquiryRequest.type_pk,
            inquiryRequest.doc_number,
            inquiryRequest.description,
            inquiryRequest.deleted
        ])

        const pk = rows[0].pk

        const typeSql = `
        SELECT
            id_1c
        FROM 
            inquiry_request_type
        WHERE 
            pk = $1`

        const resultType = await client.query(typeSql, [inquiryRequest.type_pk])
        const id_1c = resultType.rows[0].id_1c
        inquiryRequest.type_id_1c = id_1c

        const exchangeSQL = `
        INSERT INTO
            exchange(
            ex_type,
            ex_data,
            event_pk,
            ex_date,
            base_pk
            )
        VALUES
            ($1, $2, $3, $4, $5)`

        inquiryRequest.pk = pk

        await client.query(exchangeSQL, [
            'InquiryRequest',
            JSON.stringify(inquiryRequest),
            1,
            new Date,
            inquiryRequest.base_pk])

        await client.query('COMMIT')
        client.release()

        return pk

    } catch (e) {
        console.log(e)
        await client.query('ROOLBACK')
        client.release()
        throw e}
}

//Выполняется только из 1с
//Поэтому для обмена не регистрируем
module.exports.patchInquiryRequest = async (inquiryRequestData) => {

    const client = await db.client()

    try {
        await client.query('BEGIN')

        for (field of inquiryRequestData.fields){
            const sql = `
            UPDATE
                inquiry_request
            SET
                ` + field.name + ` = $1
            WHERE 
                pk = $2`


            console.log(sql)
            await client.query(sql, [field.value,
                                    inquiryRequestData.pk])
        }

        await client.query('COMMIT')
        client.release()

    } catch (e) {
        console.log(e)
        await client.query('ROOLBACK')
        client.release()
        throw e}
}