const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const generatePassword = require('password-generator')
const {validationResult} = require('express-validator')
const User = require('../models/User')
const tokenService = require('../service/token-service')
const mailService = require('../service/mail-service')

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) 
                return res.status(400).json({message: "Некорректные данные для ввода!", errors})
            const {username, email} = req.body
            const candidate = await User.findOne({username})
            if (candidate)
                return res.status(400).json({message: "Имя занято!"})
            const password = generatePassword(12, false)
            const hashPassword = bcrypt.hashSync(password, 7)
            const user = new User({email, username, password: hashPassword})
            await mailService.sendActivationMail(email, username, password)
            await user.save()
            return res.status(200).json({ message: "На Вашу почту было отправлено письмо с паролем"})
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Ошибка регистрации"})
        }
    }
    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user)
                return res.status(400).json({message: "Неверные данные!"})
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) 
                return res.status(400).json({message: "Неверные данные!"})
            const token = tokenService.generateAccessToken(user._id, user.username)
            return res.json({token})
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Ошибка входа"})
        }
    }
    async auth(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (token === 'null')
                return res.status(401).json({message: "Пользователь не авторизован!"})
            const decodedToken = jwt.verify(token, process.env.SECRET)
            const user = await User.findOne({ _id: decodedToken.id })
            let clearUser = {
                id: user.id,
                username: user.username
            }
            return res.json({user: clearUser})
        } catch (e) {
            console.log(e)
            return res.status(401).json({message: "Ошибка аутентификации. Необходима повторная авторизация!"})
        }
    }
}

module.exports = new authController()