const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')
const db = require('../shared/pgdb')
const passport = require('passport')

saveUser = async (user) => {
    const client = await db.client()

    try {
        await client.query('BEGIN')

        const sql = `
                INSERT INTO 
                    users(
                        email,
                        user_password,
                        surname,
                        patronymic,
                        id_1c,
                        base_pk)
                VALUES ($1, $2, $3, $4, $5, $6, $7)     
                `
        const {rows} = await client.query(sql,
            [user.email,
            bcrypt.hashSync(user.password, salt),
            user.surname,
            user.user_name,
            user.patronymic,
            user.id_1c,
            user.base_pk]);

        const pk = rows[0].pk

        for (userGroup of user.roles){
            const sqlGroup = `
            INSERT INTO
                users_groups(
                    group_pk,
                    user.pk)
                VALUES($1, S2)
                `
            await client.query(sqlGroup,
                [userGroup, pk]);
        }

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
    }
}

saveFirstUser = async (user) => {
    const client = await db.client()

    try {
        await client.query('BEGIN')

        const sqlNewBase = `
                INSERT INTO
                    bases(base_pk, description)
                VALUES($1, $2)
                RETURNING 
                    base_pk`

        const {rows: baseRows} = await client.query(sqlNewBase, [0, user.base_description])
        const basePk = baseRows[0]
        const sql = `
                INSERT INTO 
                    users(
                        email,
                        user_password,
                        surname,
                        user_name,
                        patronymic,
                        id_1c,
                        base_pk)
                VALUES ($1, $2, $3, $4, $5, $6, $7)  
                RETURNING 
                        pk
                `
               
        const {rows} = await client.query(sql,
            [user.email,
                user.user_password,
                user.surname,
                user.user_name,
                user.patronymic,
                user.id_1c,
                basePk.base_pk]);

        const pk = rows[0].pk

        for (userGroup of user.roles){
            const sqlGroup = `
            INSERT INTO
                users_groups(
                    group_pk,
                    user_pk)
                VALUES($1, $2)
                `
            await client.query(sqlGroup,
                [userGroup, pk]);
        }

        await client.query('COMMIT')
        client.release()

        return {
            email: user.email,
            password: user.user_password,
            pk: pk,
            base_pk: basePk.base_pk,
            roles: user.roles
        }
    
    } 
    catch (e) {
        await client.query('ROOLBACK')
        client.release()
    }
}

findUserByEmail = async (value) => {

    try {
        const client = await db.client()

        await client.query('BEGIN')
        const sql = `SELECT pk, email, user_password, base_pk  FROM users WHERE email = $1`;
        const {rows} = await client.query(sql, [value.email]);
        const user = rows[0]

        if (!user) {return user}

        const sqlGroup = `SELECT group_pk FROM users_groups WHERE user_pk = $1`
        const {rows: userGroup} = await client.query(sqlGroup, [user.pk])
        const roles = []

        for (group of userGroup){
            if (group.group_pk === 2) {roles.push("SuperAdmin")}
            else if (group.group_pk === 1) {roles.push("Admin")}
            else if (group.group_pk === 0) {roles.push("User")}
            else roles.push("Undefined")
        }

        user.roles = roles

        await client.query('COMMIT')
        client.release()

        return user
    } catch (e) {
        errorHandler(value, e)

        if (typeof client !== 'undefined') {
            await client.query('ROOLBACK')
            client.release()          
        }
        return null
    }
}

getFirstUser = async (value) => {
    try {
    const sql = `SELECT *  FROM users LIMIT 1`;
    const {rows} = await db.query(sql);

        return rows[0]
    } catch (e) {
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
            const user = {
                email: candidate.email,
                userId: candidate.pk,
                roles: candidate.roles,
                basePk: candidate.base_pk
            }
            const token = jwt.sign(user, keys.jwt, {expiresIn: 60 * 60 * 24})

            res.status(200).json({
                user: {
                    id: candidate.pk,
                    roles: candidate.roles,
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
    } else if (candidate == null) {
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера.'
        })
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
            id_1c: req.body.id_1c,
            roles:[2],
            base_description: 'base_description'
        }

        try {
            const resp = await saveFirstUser(user);
            res.status(200).json({
                roles: user.roles,
                basePk: resp.base_pk,
                pk: resp.pk
            })
        } catch (e) {
            errorHandler(res, e)
        }
    }
}

module.exports.checkPermission = (roles = ['User']) =>{

    return (req, res, next) =>{
        passport.authenticate('jwt', {session: false })(req, res, ()=>{
            if (roles === []){
                next()
                return
            } else {
                if (req.user.roles.findIndex(currentValue => currentValue === 'SuperAdmin')>=0) {
                    next()
                    return}
                for (role of roles){
                    if (req.user.roles.findIndex(currentValue => currentValue === role)>=0){
                        next()
                        return
                    }
                }
                res.status(401).json({message: 'Permission denied'})
            }
        })
    }

}
