const errorHandler = require('../utils/errorHandler')
const db = require('../shared/pgdb')

module.exports.getEmployeeDataById = async function (req, res) {
    try {
        const value = req.user.pk
        const sql = `  SELECT 
                          workplace.employee_pk,
                          workplace.date_from,
                          subdivision.subdivision_name,
                          employee_position.position_name,
                          organization.organization_name,
                          users.surname, 
                          users.user_name, 
                          users.patronymic, 
                          users.image_src, 
                          users.id_1c 
                        FROM 
                          users as users 
                            left join employee as employee on ( users.id_1c = employee.user_id_1c and users.base_pk = employee.base_pk )   
                            left join workplace as workplace 
                              inner join (SELECT 
                                          workplace.employee_pk as employee_pk,
                                          max(workplace.date_from) as date_from 
                                       FROM workplace
                                          inner join employee on ( workplace.employee_pk = employee.pk and workplace.base_pk = employee.base_pk) 
                                             inner join users on ( employee.user_id_1c = users.id_1c and employee.base_pk = users.base_pk) 
                                       WHERE 
                                          date_from <= $1 AND
                                          users.pk = $2
                                       GROUP BY
                                          workplace.employee_pk) as vt_workplace_slice 
                                       on (workplace.employee_pk = vt_workplace_slice.employee_pk
                                                                                  and workplace.date_from = vt_workplace_slice.date_from)                          
                            
                            on (employee.pk = workplace.employee_pk AND employee.base_pk = workplace.base_pk)
                            left join subdivision as subdivision on (workplace.subdivision_pk = subdivision.pk)
                            left join employee_position as employee_position on (workplace.position_pk = employee_position.pk)
                            left join organization as organization on (subdivision.organization_pk = organization.pk)
                          WHERE 
                            users.pk = $3`
        const today = new Date()
        today.setHours(23, 59, 59, 999)

        const {rows} = await db.query(sql, [today, value, value]);

        let userData = null
        if (rows.length) {
            userData = rows[0]
        }

        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createEmployeeWorkplace = async function (req, res) {
    try {
        const workplace = req.body
        const sql = `
        INSERT INTO 
            workplace (
              position_pk, 
              subdivision_pk,
              employee_pk,
              date_from,
              base_pk          
             ) 
        VALUES($1, $2, $3, $4, $5)
        RETURNING position_pk as pk`

        const {rows} = await db.query(sql,
            [workplace.position_pk,
                workplace.subdivision_pk,
                workplace.employee_pk,
                workplace.date_from,
                workplace.base_pk]);

        const userData = rows[0]
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.createEmployeeWorkplaces = async function (req, res) {
    const client = await db.client()
    try {
        const employeeWorkplacesData = req.body
        await client.query('BEGIN')

        const deleteSql = 'DELETE FROM workplace WHERE base_pk = $1 AND employee_pk = $2'
        const result = await client.query(deleteSql,
            [employeeWorkplacesData.base_pk,
                employeeWorkplacesData.employee_pk]);

        employeeWorkplacesData.workplaces.forEach(async workplace => {
            const sql = `
            INSERT INTO 
                workplace (
                  position_pk, 
                  subdivision_pk,
                  employee_pk,
                  date_from,
                  base_pk          
                 ) 
            VALUES($1, $2, $3, $4, $5)
            RETURNING position_pk as pk`

            const result = await client.query(sql,
                [workplace.position_pk,
                    workplace.subdivision_pk,
                    employeeWorkplacesData.employee_pk,
                    workplace.date_from,
                    employeeWorkplacesData.base_pk]);
        })

        await client.query('COMMIT')
        client.release()
        const userData = {pk: employeeWorkplacesData.employee_pk}

        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        await client.query('ROOLBACK')
        client.release()
        throw e
    }
}

module.exports.deleteEmployeeWorkplace = async function (req, res) {
    try {
        const workplace = req.body

        const sql = `
        DELETE FROM
            workplace 
        WHERE    
              employee_pk = $1 AND 
              base_pk = $2`;
        const {rows} = await db.query(sql,
            [workplace.employee_pk,
                workplace.base_pk]);

        const userData = {pk: workplace.employee_pk}
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.createEmployee = async function (req, res) {
    try {
        const employee = req.body

        const sql = `
        INSERT INTO 
            employee (
              pk, 
              base_pk,
              user_id_1c       
             ) 
        VALUES($1, $2, $3)
        RETURNING pk`
        const {rows} = await db.query(sql,
            [employee.pk,
                employee.base_pk,
                employee.user_id_1c]);

        const userData = rows[0]
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.getPaymentList = async function (req, res) {
    try {
        const paymentList = req.query
        const sql = `
        SELECT
            payment_list.payment_month,
            payment_list.employee_pk,
            payment_list.base_pk,
            payment_list.payment_position,
            payment_list.payment_sum,
            payment_list.payment_group,
            payment_list.payment_group_id 
        FROM
            payment_list INNER JOIN employee ON (employee.pk = payment_list.employee_pk AND employee.base_pk = payment_list.base_pk)
               INNER JOIN users ON (employee.user_id_1c = users.id_1c AND employee.base_pk = users.base_pk)
        WHERE    
            users.pk = $1 AND 
            payment_month = $2
        ORDER BY
            payment_list.employee_pk,
            payment_list.payment_group_id,
            payment_list.payment_group,
            payment_list.payment_position`
        const {rows} = await db.query(sql, [paymentList.pk,
            paymentList.payment_month]);

        const paymentData = []
        let currentGroup = ''

        rows.forEach(item => {
            if (currentGroup != item.payment_group) {
                let paymentBlock = {
                    group: item.payment_group,
                    items: []
                }
                paymentData.push(paymentBlock)
                currentGroup = item.payment_group
            }
            paymentData[paymentData.length - 1].items.push(item)
        })

        const userData = paymentData
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.createPaymentList = async function (req, res) {
    const client = await db.client()

    try {
        const paymentList = req.body

        await client.query('BEGIN')

        const sql = `
        DELETE  FROM
            payment_list 
        WHERE    
              employee_pk = $1 AND 
              base_pk = $2 AND
              payment_month = $3`;
        const {rows} = await client.query(sql,
            [paymentList.employee_pk,
                paymentList.base_pk,
                paymentList.payment_month]);

        const payments = paymentList.payments
        payments.forEach(async (item) => {
            const sql = `
        INSERT INTO 
            payment_list (
              payment_month, 
              employee_pk,
              base_pk,
              payment_position,
              payment_sum,
              payment_group,
              payment_group_id          
             ) 
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING employee_pk as pk`

            const {rows} = await client.query(sql,
                [paymentList.payment_month,
                    paymentList.employee_pk,
                    paymentList.base_pk,
                    item.payment_position,
                    item.payment_sum,
                    item.payment_group,
                    item.payment_group_id]);
        });

        return {pk: paymentList.employee_pk}

        await client.query('COMMIT')
        client.release()

        const userData = {pk: paymentList.employee_pk}
        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        await client.query('ROOLBACK')
        client.release()
        throw e
    }
}
