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
        })

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

module.exports.updateWorkSchedule = async function (req, res) {
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

        const employeeSql = `
            SELECT
                pk 
            FROM 
                employee
            WHERE
                id_1c = $1`
        const {rows: employee} = await client.query(employeeSql,
            [workScheduleData.emloyee_id_1c]);

        const employee_pk = employee[0].pk

        const deletySql = `
            DELETE FROM
                types_of_time
            WHERE     
                emloyee_pk = $1
                AND work_date >= $2
                AND work_date <= $3`
        await client.query(deletySql,
            [workScheduleData.base_pk,
                workScheduleData.begin_date,
                workScheduleData.end_date]);

        for (itemDate of workScheduleData.items) {

            const types_of_time_pk = typesOfTime.find(c => c.id === itemDate.types_of_time_id_1c)

            const insertSql = '' +
                `INSERT INTO 
                types_of_time{
                    emloyee_pk,
                    work_date,
                    work_hour,
                    types_of_time_pk)
             VALUES($1, $2, $3, $4) `
            await client.query(insertSql,
                [employee_pk,
                    itemDate.work_date,
                    itemDate.work_hour,
                    types_of_time_pk])
        }


        await client.query('COMMIT')
        client.release()

        res.status(200)
    } catch (e) {
        errorHandler(res, e)
        await client.query('ROOLBACK')
        client.release()
        throw e
    }
}

module.exports.createPersonalWorkSchedulesData = async function (req, res) {
    const client = await db.client()

    try {
        const workScheduleData = req.body

        await client.query('BEGIN')

        const deletySql = `
            DELETE FROM
                personal_work_schedules_data
            WHERE  
                base_pk = $1   
                AND employee_id_1c = $2
                AND work_date = $3`
        await client.query(deletySql,
            [workScheduleData.base_pk,
                workScheduleData.employee_id_1c,
                workScheduleData.work_date]);

        for (itemDate of workScheduleData.items) {

            const insertSql =
                `INSERT INTO 
                    personal_work_schedules_data(
                        base_pk,
                        employee_id_1c,
                        work_date,
                        types_of_time_id_1c,
                        work_hour)
                VALUES($1, $2, $3, $4, $5) `
            await client.query(insertSql,
                [workScheduleData.base_pk,
                    workScheduleData.employee_id_1c,
                    workScheduleData.work_date,
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

module.exports.createEmployeeWorkSchedulesData = async function (req, res) {
    const client = await db.client()

    try {
        const employeeData = req.body

        await client.query('BEGIN')


        const deletySql = `
            DELETE FROM
                employee_work_schedules
            WHERE  
                base_pk = $1   
                AND employee_id_1c = $2
                AND date_from >= $3`
        await client.query(deletySql,
            [employeeData.base_pk,
                employeeData.employee_id_1c,
                employeeData.date_from]);

        for (itemDate of employeeData.items) {

            const insertSql =
                `INSERT INTO 
                        employee_work_schedules(
                            base_pk,
                            employee_id_1c,
                            date_from,
                            date_to,
                            work_schedules_id_1c)
                    VALUES($1, $2, $3, $4, $5) `
            await client.query(insertSql,
                [employeeData.base_pk,
                    employeeData.employee_id_1c,
                    itemDate.date_from,
                    itemDate.date_to,
                    itemDate.work_schedules_id_1c])
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

module.exports.getEmployeeWorkSchedulesDataForPeriod = async function (req, res) {
    const client = await db.client()

    try {
        const params = req.query

        await client.query('BEGIN')

        params.begin_date = new Date(params.year, 0, 1, 0, 0, 0, 0)
        params.end_date = new Date(+params.year+1 , 1, 1, 0, 0, 0, 0)

        const sqlCreate = `
                    Create Temp Table Prioritet AS
                    Select DISTINCT
                           personal_work_schedules_data.employee_id_1c,   
                           personal_work_schedules_data.base_pk as base_pk,
                           personal_work_schedules_data.work_date
                    From personal_work_schedules_data
                         inner join employee on (personal_work_schedules_data.employee_id_1c = employee.pk
                                                and personal_work_schedules_data.base_pk = employee.base_pk)
                                    inner join users on (employee.user_id_1c = users.id_1c
                                                        and employee.base_pk = users.base_pk)   
                    where 
                               personal_work_schedules_data.work_date >= $1
                               and personal_work_schedules_data.work_date < $2
                               and personal_work_schedules_data.base_pk = $3
                               and users.pk = $4;`
        client.query(sqlCreate, [params.begin_date,
            params.end_date,
            params.base_pk,
            params.pk])
        const sqlSel = `
                    Select 
                        * 
                    FROM
                        (
                            (Select
                                data.work_date,
                                data.work_hour,
                                data.time_name,
                                data.time_kod,
                                data.employee_id_1c, 
                                q
                            FROM     
                                (Select
                                general_work_schedules_data.work_date,
                                general_work_schedules_data.work_hour,
                                types_of_time.time_name,
                                types_of_time.time_kod,
                                employee_work_schedules.employee_id_1c, 
                                1 as q
                                From 
                                     employee_work_schedules
                                     inner join employee on (employee_work_schedules.employee_id_1c = employee.pk
                                                            and employee_work_schedules.base_pk = employee.base_pk)
                                                inner join users on (employee.user_id_1c = users.id_1c
                                                                    and employee.base_pk = users.base_pk)                         
                                     inner join general_work_schedules_data on 
                                           (employee_work_schedules.work_schedules_id_1c = general_work_schedules_data.work_schedule_id_1c
                                           and employee_work_schedules.base_pk = general_work_schedules_data.base_pk
                                           and employee_work_schedules.date_from <= general_work_schedules_data.work_date
                                           and employee_work_schedules.date_to > general_work_schedules_data.work_date
                                           and general_work_schedules_data.work_date >= $1
                                           and general_work_schedules_data.work_date < $2
                                           )
                                               inner join types_of_time on 
                                                    (general_work_schedules_data.base_pk = types_of_time.base_pk
                                                    and general_work_schedules_data.types_of_time_id_1c = types_of_time.id_1c)
                                Where
                                      ((employee_work_schedules.date_from >= $3
                                     and employee_work_schedules.date_from < $4)
                                     or                         
                                     (     employee_work_schedules.date_to >= $5
                                     and employee_work_schedules.date_to < $6)
                                     or
                                     (employee_work_schedules.date_from <= $7
                                     and employee_work_schedules.date_to > $8))
                                     and 
                                     users.pk = $9
                                     and employee_work_schedules.base_pk = $10
                                ) as data
                                left join Prioritet on (data.employee_id_1c = Prioritet.employee_id_1c
                                                         and data.work_date = Prioritet.work_date)
                                Where 
                                    Prioritet.base_pk is NULL                           
                            )
                            UNION all
                            (Select
                            personal_work_schedules_data.work_date,
                            personal_work_schedules_data.work_hour,
                            types_of_time.time_name,
                            types_of_time.time_kod,
                            employee_work_schedules.employee_id_1c,
                            2
                            From
                                 employee_work_schedules
                                 inner join employee on (employee_work_schedules.employee_id_1c = employee.pk
                                                        and employee_work_schedules.base_pk = employee.base_pk)
                                            inner join users on (employee.user_id_1c = users.id_1c
                                                                and employee.base_pk = users.base_pk)
                                 inner join personal_work_schedules_data on
                                       (personal_work_schedules_data.employee_id_1c = employee_work_schedules.employee_id_1c
                                       and employee_work_schedules.base_pk = personal_work_schedules_data.base_pk
                                       and employee_work_schedules.date_from <= personal_work_schedules_data.work_date
                                       and employee_work_schedules.date_to > personal_work_schedules_data.work_date
                                       and personal_work_schedules_data.work_date >= $11
                                       and personal_work_schedules_data.work_date < $12
                                       )
                                           inner join types_of_time on
                                                (personal_work_schedules_data.base_pk = types_of_time.base_pk
                                                and personal_work_schedules_data.types_of_time_id_1c = types_of_time.id_1c)
                                       left join Prioritet on (personal_work_schedules_data.employee_id_1c = Prioritet.employee_id_1c
                                                                    and personal_work_schedules_data.base_pk = Prioritet.base_pk
                                                                    and personal_work_schedules_data.work_date = Prioritet.work_date)                                        
                            Where
                                 (employee_work_schedules.date_from >= $13
                                 and employee_work_schedules.date_from < $14)
                                 or
                                 (     employee_work_schedules.date_to >= $15
                                 and employee_work_schedules.date_to < $16)
                                 or
                                 (     employee_work_schedules.date_from <= $17
                                 and employee_work_schedules.date_to > $18)
                                 and
                                 users.pk = $19
                                 and
                                 employee_work_schedules.base_pk = $20
                            )
                        )  as endData
                    Order by
                        employee_id_1c,
                        work_date`
        const {rows} = await client.query(sqlSel,
            [params.begin_date,
                params.end_date,
                params.begin_date,
                params.end_date,
                params.begin_date,
                params.end_date,
                params.begin_date,
                params.end_date,
                params.pk,
                params.base_pk,
                params.begin_date,
                params.end_date,
                params.begin_date,
                params.end_date,
                params.begin_date,
                params.end_date,
                params.begin_date,
                params.end_date,
                params.pk,
                params.base_pk]);

        const sqlDel = 'DROP Table Prioritet'
        await client.query(sqlDel)

        client.query('COMMIT')
        client.release()

        const result = []
        let currentEmployee = null
        let currentMonth = null
        let employeeBlock = null
        let monthBlock = null
        for (item of rows) {
            if (item.employee_id_1c !== currentEmployee) {
                currentMonth = null
                employeeBlock = {
                    employee: item.employee_id_1c,
                    months: []
                }
                result.push(employeeBlock)
                currentEmployee = item.employee_id_1c
                currentMonth = null
                monthBlock = null
            }
            if (item.work_date.getMonth() !== currentMonth) {
                monthBlock = {
                    month: item.work_date.getMonth(),
                    days: []
                }
                employeeBlock.months.push(monthBlock)
                currentMonth = item.work_date.getMonth()
            }

            monthBlock.days.push(item)
        }

        res.status(200).json(result)
    } catch (e) {
        errorHandler(res, e)
        await client.query('ROOLBACK')
        client.release()
        throw e
    }
}


