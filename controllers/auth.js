const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')


module.exports.login = async function(req, res) {

    const candidate = await User.findUserByEmail({email: req.body.email})

    if (candidate) {
        // Проверка пароля, пользователь существует
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.user_password)
        if (passwordResult) {
            // Генерация токена, пароли совпали
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate.pk
            }, keys.jwt, {expiresIn: 60*60*24})

            res.status(200).json({
                user: {
                    id: candidate.pk,
                    isAdmin: false,
                    basePk: candidate.base_pk                },
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

module.exports.register = async function(req, res) {

    const firstUser = await User.getFirstUser()
    if (firstUser) {
        res.status(409).json({
            message: 'Пользователи уже существуют! Регистрация не возможна.',
            pk: firstUser.pk
        })
        return
    }

    const candidate = await User.findUserByEmail({email: req.body.email})

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
            const resp = await User.save(user);
            res.status(200).json({
                email: user.email,
                password: user.user_password,
                pk: resp.pk
                })
        } catch(e) {
            errorHandler(res, e)
        }

    }
}