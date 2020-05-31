const db = require('../shared/pgdb')

module.exports.addOrUpdateOrganisation = async (organisation) => {

    const sql = `
        SELECT 
            res_pk as pk 
        FROM 
            public."InsertUpdateOrganisation"($1, $2, $3)`;
    const {rows} = await db.query(sql,
        [organisation.organization_name,
            organisation.pk,
            organisation.base_pk]);

    return rows[0]

}

module.exports.addOrUpdateSubdivision = async (subdivision) => {

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

    return rows[0]

}

module.exports.createEmployeePosition = async (employeePosition) => {

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

    return rows[0]

}

module.exports.updateEmployeePosition = async (employeePosition) => {

    console.log('fsdkfh')

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

    return {pk: employeePosition.pk}
}

module.exports.deleteEmployeePosition = async (employeePosition) => {

    const sql = `
        DELETE FROM employee_position        
        WHERE
         pk = $1 AND
         base_pk = $2`;
    const {rows} = await db.query(sql,
        [employeePosition.pk,
            employeePosition.base_pk]);

    return {pk: employeePosition.pk}

}

module.exports.createInquiryRequestType = async (inquiryRequestType) => {

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

    return rows[0]

}