const errorHandler = require('../utils/errorHandler')
const db = require('../shared/pgdb')
const bcrypt = require('bcryptjs')

module.exports.getUserInfoById = async function (req, res) {
    try{
        const value = req.user.pk
        const sql = `SELECT surname, user_name, patronymic  FROM users WHERE pk = $1 and base_pk = $2`;
        const {rows} = await db.query(sql, [value, req.user.base_pk]);

        let userData = null
        if (rows.length) {
            userData = rows[0]
        }

        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.createUser = async function (req, res) {
    const client = await db.client()

    try {
        await client.query('BEGIN')
        const user = req.body

        const sql = `
        INSERT INTO  
          users(surname,
                  user_name,
                  patronymic,
                  id_1c,
                  email,
                  user_password, 
                  base_pk) 
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING pk`;

        const salt = bcrypt.genSaltSync(10)
        const password = user.user_password
        const user_password = bcrypt.hashSync(password, salt)

        const {rows} = await db.query(sql,
            [user.surname,
                user.user_name,
                user.patronymic,
                user.id_1c,
                user.email,
                user_password,
                user.base_pk]);

        const pk = rows[0].pk

        const sqlGroup = `
            INSERT INTO
                users_groups(
                    group_pk,
                    user.pk)
                VALUES($1, S2)
                `
        await client.query(sqlGroup,
                [0, pk]);


        await client.query('COMMIT')
        client.release()

        return {
            email: user.email,
            password: user.user_password,
            pk,
            base_pk: user.base_pk,
            roles: user.roles
        }
    } catch (e) {
        errorHandler(res, e)
        await client.query('ROOLBACK')
        client.release()
        throw e
    }
}

module.exports.updateUser = async function (req, res) {
    try {
        const user = req.boby

        const sql = `
        UPDATE 
          users 
        SET
          surname = $1,
          user_name = $2,
          patronymic = $3,
          id_1c = $4,
          email = $5,
          user_password = $6 )          
        WHERE
          pk = $7 
          and base_pk = $8`;

        const salt = bcrypt.genSaltSync(10)
        const password = user.user_password
        const user_password = bcrypt.hashSync(password, salt)

        const {rows} = await db.query(sql,
            [user.surname,
                user.user_name,
                user.patronymic,
                user.id_1c,
                user.email,
                user_password,
                user.pk,
                user.base_pk]);

        const userData = {pk: user.pk}

        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.deleteUser = async function (req, res) {
    try {
        const sql = `
        DELETE FROM users        
        WHERE
         pk = $1 and base_pk`;
        const {rows} = await db.query(sql,
            [user.pk, user.base_pk]);

        const userData = {pk: user.pk}


        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}


