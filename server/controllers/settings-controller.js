const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const mailService = require('../service/mail-service')

class SettingsController {
    constructor(io) {
        this.io = io
    }
    async changePassword(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token)
                return res.status(401).json({message: "Пользователь не авторизован!"})
            const decodedToken = jwt.verify(token, process.env.SECRET)
            const { currentPassword, newPassword } = req.body
            const user = await User.findOne({ _id: decodedToken.id })
            const validCurrentPassword = bcrypt.compareSync(currentPassword, user.password)
            if (!validCurrentPassword) 
                return res.status(400).json({message: "Неверный текущий пароль!"})
            const hashNewPassword = bcrypt.hashSync(newPassword, 7)
            await User.findOneAndUpdate({ _id: decodedToken.id }, {
                password: hashNewPassword,
                isActivated: true
            })
            console.log(user)
            await mailService.changePasswordNotification(user.email)
            return res.status(200).json({message: "Пароль успешно изменен!"})
        } catch(e) {
            console.log(e)
            return res.status(400).json({message: "Не удалось сменить пароль!"})
        }
    }
}

module.exports = SettingsController