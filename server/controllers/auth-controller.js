const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const generatePassword = require('password-generator')
const User = require('../models/User')
const tokenService = require('../service/token-service')
const mailService = require('../service/mail-service')

class authController {
    constructor(io) {
        this.io = io
    }
    async registration(req, res) {
        try {
            const { username, password, email } = req.body
            const usernameTaken = await User.findOne({ username })
            if (usernameTaken)
                return res.status(400).json({ type: 'error', code: 1, message: "Это имя пользователя уже используется!" })
            const emailTaken = await User.findOne({ email })
            if (emailTaken)
                return res.status(400).json({ type: 'error', code: 2, message: "Эта почта уже используется!" })
            const hashPassword = bcrypt.hashSync(password, 7)
            const user = new User({ email, username, password: hashPassword })
            await user.save()
            return res.status(200).json({ type: 'success', code: 0, message: "Аккаунт был успешно создан!" })
        } catch(e) {
            console.log(e)
            return res.status(500).json({ type: 'error', code: 99, message: "Неизвестная ошибка. Попробуй позже" })
        }
    }
    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })
            if (!user)
                return res.status(400).json({ type: 'error', code: 1, message: "Неверное имя пользователя или пароль!" })
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword)
                return res.status(400).json({ type: 'error', code: 1, message: "Неверное имя пользователя или пароль!" })
            const token = tokenService.generateAccessToken(user._id, user.username)
            return res.status(200).json({ type: 'success', code: 0, token })
        } catch(e) {
            console.log(e)
            return res.status(500).json({ type: 'error', code: 99, message: "Неизвестная ошибка. Попробуй позже" })
        }
    }
    async auth(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token)
                return res.status(401).json({ type: 'error', code: 41, message: "Доступно только авторизованным пользователям!" })
            let decodedToken = undefined
            try {
                decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            } catch(e) {
                return res.status(401).json({ type: 'error', code: 41, message: "Необходима повторная авторизация!" })
            }
            const user = await User.findOne({ _id: decodedToken.id }, { id: 1, username: 1 })
            return res.status(200).json({ type: 'success', code: 0, user })
        } catch(e) {
            console.log(e)
            return res.status(500).json({ type: 'error', code: 99, message: "Неизвестная ошибка. Попробуй позже" })
        }
    }
}

module.exports = authController