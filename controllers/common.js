const errorHandler = require('../utils/errorHandler')
const db = require('../shared/pgdb')

module.exports.addOrUpdateOrganisation = async function(req, res) {
    try {
        const organisation = req.body
        const sql = `
        SELECT 
            res_pk as pk 
        FROM 
            public."InsertUpdateOrganisation"($1, $2, $3)`;
        const {rows} = await db.query(sql,
            [organisation.organization_name,
                organisation.pk,
                organisation.base_pk]);

        const userData = rows[0]
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.addOrUpdateSubdivision = async function(req, res) {
    try {
        const subdivision = req.body

        const sql = `
        SELECT 
            res_pk as pk 
        FROM 
            public."InsertUpdateSubdivision"($1, $2, $3, $4, $5)`;
        const {rows} = await db.query(sql,
            [subdivision.subdivision_name,
                subdivision.pk,
                subdivision.parent_pk,
                subdivision.organization_pk,
                subdivision.base_pk]);

        const userData = rows[0]
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createEmployeePosition = async function(req, res) {
    try {
        const employeePosition = req.body
        const sql = `
        INSERT INTO  
          employee_position (
            pk, 
            position_name,
            base_pk          
          ) 
        VALUES($1, $2, $3)
        RETURNING pk`;
        const {rows} = await db.query(sql,
            [employeePosition.pk,
                employeePosition.position_name,
                employeePosition.base_pk]);

        const userData = rows[0]
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.updateEmployeePosition = async function(req, res) {
    try {
        const employeePosition = req.body
        const sql = `
        UPDATE 
          employee_position 
        SET
          position_name = $1          
        WHERE
          pk = $2 AND
          base_pk = $3
          `;
        const {rows} = await db.query(sql,
            [employeePosition.position_name,
                employeePosition.pk,
                employeePosition.base_pk]);

        const userData = {pk: employeePosition.pk}
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.deleteEmployeePosition = async function(req, res) {
    try {
        const employeePosition = req.body
        const sql = `
        DELETE FROM employee_position        
        WHERE
         pk = $1 AND
         base_pk = $2`;
        const {rows} = await db.query(sql,
            [employeePosition.pk,
                employeePosition.base_pk]);

        const userData = {pk: employeePosition.pk}
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createInquiryRequestType = async function(req, res) {
    try {
        const inquiryRequestType = req.body
        const sql = `
        INSERT INTO  
          inquiry_request_type (
            type_name,
            id_1c,
            deleted,
            base_pk         
          ) 
        VALUES($1, $2, $3, $4)
        RETURNING pk`;
        const {rows} = await db.query(sql,
            [inquiryRequestType.type_name,
                inquiryRequestType.id_1c,
                inquiryRequestType.deleted,
                inquiryRequestType.base_pk]);

        const userData = rows[0]
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getTypeOfTime = async function(req, res) {
    try {
        const typesOfTime = req.query
        const sql = `
        SELECT
            pk,
            time_name,
            id_1c,
            time_kod,
            base_pk,
            deleted,
            general_time_id_ic,
            time_name_id      
        FROM 
            types_of_time
        WHERE
            base_pk = $1`;
        const {rows} = await db.query(sql,
            [typesOfTime.base_pk]);

        const userData = rows[0]
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createTypeOfTime = async function(req, res) {
    try {
        const typesOfTime = req.body
        const sql = `
        INSERT INTO  
          types_of_time (
            time_name,
            id_1c,
            time_kod,
            base_pk,
            deleted,
            general_time_id_ic,
            time_name_id     
          ) 
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING pk`;
        const {rows} = await db.query(sql,
            [typesOfTime.time_name,
                typesOfTime.id_1c,
                typesOfTime.time_kod,
                typesOfTime.base_pk,
                typesOfTime.deleted,
                typesOfTime.general_time_id_ic,
                typesOfTime.time_name_id]);

        const userData = rows[0]
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateTypeOfTime = async function(req, res) {
    try {
        const typesOfTime = req.body
        const sql = `
        UPDATE 
            types_of_time 
        SET  
            time_name = $1,
            id_1c = $2,
            time_kod = $3,
            base_pk = $4,
            deleted = $5,
            general_time_id_ic = $6 
            time_name_id = $7      
        WHERE
            id_1c = $8
            AND base_pk = $9
        RETURNING pk`;
        const {rows} = await db.query(sql,
            [typesOfTime.time_name,
                typesOfTime.id_1c,
                typesOfTime.time_kod,
                typesOfTime.base_pk,
                typesOfTime.deleted,
                typesOfTime.general_time_id_ic,
                typesOfTime.time_name_id,
                typesOfTime.id_1c,
                typesOfTime.base_pk
            ]);

        const userData = rows[0]
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createWorkSchedule = async function(req, res) {
    try {
        const item = req.body
        const sql = `
            INSERT INTO  
              work_schedules (
                id_1c,
                base_pk,
                title     
              ) 
            VALUES($1, $2, $3)`
        const {rows} = await db.query(sql,
            [item.id_1c,
                item.base_pk,
                item.title]);

        res.status(200).json({})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateWorkSchedule = async function(req, res) {
    try {
        const item = req.body
        const sql = `
            UPDATE 
                work_schedules  
            SET  
                title = $1   
            WHERE
                id_1c = $2
                AND base_pk = $3`
        const {rows} = await db.query(sql,
            [item.title,
                item.id_1c,
                item.base_pk
            ]);

        res.status(200).json({})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createGeneralWorkSchedulesData = async function(req, res) {
    const client = await db.client()

    try {
        const workScheduleData = req.body

        await client.query('BEGIN')

        const typesSql = `
            SELECT
                pk,
                id_1c 
            FROM
                types_of_time 
            WHERE    
                  base_pk = $1`;
        const {rows: typesOfTime} = await client.query(typesSql,
            [workScheduleData.base_pk]);

        const deletySql = `
            DELETE FROM
                general_work_schedules_data
            WHERE     
                work_schedule_id_1c = $1
                AND work_date >= $2
                AND work_date <= $3
                AND base_pk = $4`
        await client.query(deletySql,
                [workScheduleData.work_schedule_id_1c,
                workScheduleData.begin_date,
                workScheduleData.end_date,
                workScheduleData.base_pk]);

        for (itemDate of workScheduleData.items){

               const insertSql =
               `INSERT INTO 
                    general_work_schedules_data(
                        base_pk,
                        work_schedule_id_1c,
                        work_date,
                        types_of_time_id_1c,
                        work_hour)
                VALUES($1, $2, $3, $4, $5) `
            await client.query(insertSql,
                    [workScheduleData.base_pk,
                    workScheduleData.work_schedule_id_1c,
                    itemDate.work_date,
                    itemDate.types_of_time_id_1c,
                    itemDate.work_hour])
        }


        await client.query('COMMIT')
        client.release()

        res.status(200).json({})
    } catch (e) {
        errorHandler(res, e)
        await client.query('ROOLBACK')
        client.release()
        throw e
    }
}
