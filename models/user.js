const db = require('../shared/pgdb')
const bcrypt = require('bcryptjs')

module.exports.findUserByEmail = async (value) => {

    try {
        const sql = `SELECT pk, email, user_password  FROM users WHERE email = $1`;
        const {rows} = await db.query(sql, [value.email]);

        if (rows.length) {
            return rows[0]
        }

        return null
    } catch (e) {
        console.log(e)
    }
}

module.exports.findUserById = async (value) => {

    try {
        const sql = `SELECT pk, email FROM users WHERE pk = $1`;
        const {rows} = await db.query(sql, [value]);

        if (rows.length) {
            return rows[0]
        }

        return null
    } catch (e) {
        console.log(e)
    }
}

module.exports.getUserInfoById = async (value) => {

    try {
        const sql = `SELECT surname, user_name, patronymic  FROM users WHERE pk = $1`;
        const {rows} = await db.query(sql, [value]);

        if (rows.length) {
            return rows[0]
        }

        return null
    } catch (e) {
        console.log(e)
    }
}

module.exports.save = async (user) => {

    try {
        const fields = Object.keys(user)
        const strFields = '(' + fields.join(', ') + ')'
        const values = Object.values(user)
        let strValues = ''

        fields.forEach((item, i) => strValues += '$' + (i + 1) + ', ')
        console.log(strFields)
        strValues = strValues.substr(0, strValues.length - 2)

        const sql = `INSERT INTO users` + strFields + ` VALUES(` + strValues + `) RETURNING pk`;

        const {rows} = await db.query(sql, values);
        console.log(rows)

        return {
            email: user.email,
            password: user.user_password,
            pk: rows[0].pk
        }

    } catch (e) {
        console.log(e)
        throw e
    }
}

module.exports.updateMainFoto = async (id1c, imageSrc) => {

    const sql = `UPDATE users SET image_src = $1 where id_1c = $2 RETURNING pk`
    const {rows} = await db.query(sql, [imageSrc, id1c]);

    return rows[0]

}

module.exports.createUser = async (user) => {

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

    return rows[0]

}

module.exports.updateUser = async (user) => {

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

    return {pk: user.pk}

}

module.exports.deleteUser = async (user) => {

    try {
        const sql = `
        DELETE FROM users        
        WHERE
         pk = $1`;
        const {rows} = await db.query(sql,
            [user.pk]);

        return {pk: user.pk}

    } catch (e) {
        console.log(e)
    }

    return null
}

module.exports.getFirstUser = async (value) => {

    try {
        const sql = `SELECT *  FROM users LIMIT 1`;
        const {rows} = await db.query(sql);

        if (rows.length) {
            return rows[0]
        }

        return null
    } catch (e) {
        console.log(e)
    }
}



