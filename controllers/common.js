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
