const errorHandler = require('../utils/errorHandler')
const db = require('../shared/pgdb')
const bcrypt = require('bcryptjs')

module.exports.getUserInfoById = async function (req, res) {
    try{
        const value = req.user.pk
        const sql = `SELECT surname, user_name, patronymic  FROM users WHERE pk = $1`;
        const {rows} = await db.query(sql, [value]);

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
    try {
        const user = req.body

        const sql = `
        INSERT INTO  
          users(surname,
                  user_name,
                  patronymic,
                  id_1c,
                  email,
                  user_password) 
        VALUES($1, $2, $3, $4, $5, $6)
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
                user_password]);

        const userData = rows[0]

        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
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
          pk = $7`;

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
                user.pk]);

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
         pk = $1`;
        const {rows} = await db.query(sql,
            [user.pk]);

        const userData = {pk: user.pk}


        res.status(200).json(userData)
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}


