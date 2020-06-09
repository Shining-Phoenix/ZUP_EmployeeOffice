const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')
const db = require('../shared/pgdb')

saveUser = async (user) => {
    const fields = Object.keys(user)
    const strFields = '(' + fields.join(', ') + ')'
    const values = Object.values(user)
    let strValues = ''

    fields.forEach((item, i) => strValues += '$' + (i + 1) + ', ')
    console.log(strFields)
    strValues = strValues.substr(0, strValues.length - 2)

    const sql = `INSERT INTO users` + strFields + ` VALUES(` + strValues + `) RETURNING pk`;
    try {
        const {rows} = await db.query(sql, values);

        return {
            email: user.email,
            password: user.user_password,
            pk: rows[0].pk
        }
    } catch (e) {
        errorHandler(user, e)
        throw e
    }
}

findUserByEmail = async (value) => {
    try {
        const sql = `SELECT pk, email, user_password, base_pk  FROM users WHERE email = $1`;
        const {rows} = await db.query(sql, [value.email]);

        return rows[0]
    } catch (e) {
        errorHandler(value, e)
        throw e
    }
}

getFirstUser = async (value) => {
    try {
    const sql = `SELECT *  FROM users LIMIT 1`;
    const {rows} = await db.query(sql);

        return rows[0]
    } catch (e) {
        errorHandler(res, e)
        throw e
    }
}

module.exports.login = async function (req, res) {
    const candidate = await findUserByEmail({email: req.body.email})

    if (candidate) {
        // Проверка пароля, пользователь существует
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.user_password)
        if (passwordResult) {
            // Генерация токена, пароли совпали
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate.pk
            }, keys.jwt, {expiresIn: 60 * 60 * 24})

            res.status(200).json({
                user: {
                    id: candidate.pk,
                    isAdmin: false,
                    basePk: candidate.base_pk
                },
                token: `Bearer ${token}`
            })
        } else {
            // Пароли не совпали
            res.status(401).json({
                message: 'Пароли не совпадают. Попробуйте снова.'
            })
        }
    } else {
        // Пользователя нет, ошибка
        res.status(404).json({
            message: 'Пользователь с таким email не найден.'
        })
    }
}

module.exports.register = async function (req, res) {
    const firstUser = await getFirstUser()
    if (firstUser) {
        res.status(409).json({
            message: 'Пользователи уже существуют! Регистрация не возможна.',
            pk: firstUser.pk
        })
        return
    }

    const candidate = await findUserByEmail({email: req.body.email})

    if (candidate) {
        res.status(409).json({
            message: 'Такой email уже занят. Попробуйте другой.'
        })
    } else {
        // Нужно создать пользователя
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.user_password
        const user = {
            email: req.body.email,
            user_password: bcrypt.hashSync(password, salt),
            surname: req.body.surname,
            user_name: req.body.user_name,
            patronymic: req.body.patronymic,
            id_1c: req.body.id_1c
        }

        try {
            const resp = await saveUser(user);
            res.status(200).json({
                email: user.email,
                password: user.user_password,
                pk: resp.pk
            })
        } catch (e) {
            errorHandler(res, e)
            throw e
        }
    }
}
