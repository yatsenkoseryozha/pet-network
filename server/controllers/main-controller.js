const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const Conversation = require('../models/Conversation')
const Message = require('../models/Message')

const mailService = require('../service/mail-service')

class MainController {
    constructor(io) {
        this.io = io
    }
    async getUsers(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token)
                return res.status(401).json({ type: 'error', code: 41, message: "Доступно только авторизованным пользователям!" })
            let decodedToken = undefined
            try {
                decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            } catch (e) {
                return res.status(401).json({ type: 'error', code: 41, message: "Необходима повторная авторизация!" })
            }
            const { username } = req.body
            const users = await User.find({
                $and: [
                    { username: { $regex: `^${username}`, $options: 'i' } },
                    { username: { $nin: decodedToken.username } }
                ]
            }, { id: 1, username: 1 })
            return res.status(200).json({ type: 'success', code: 0, users })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ type: 'error', code: 99, message: "Неизвестная ошибка. Попробуй позже" })
        }
    }
    async createConversation(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token)
                return res.status(401).json({ type: 'error', code: 41, message: "Доступно только авторизованным пользователям!" })
            let decodedToken = undefined
            try {
                decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            } catch (e) {
                return res.status(401).json({ type: 'error', code: 41, message: "Необходима повторная авторизация!" })
            }
            const { members } = req.body
            const conversation = new Conversation({ members })
            await conversation.save()
            return res.status(200).json({ type: 'success', code: 0, conversation })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ type: 'error', code: 99, message: "Неизвестная ошибка. Попробуй позже" })
        }
    }
    async getConversations(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token)
                return res.status(401).json({ type: 'error', code: 41, message: "Доступно только авторизованным пользователям!" })
            let decodedToken = undefined
            try {
                decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            } catch (e) {
                return res.status(401).json({ type: 'error', code: 41, message: "Необходима повторная авторизация!" })
            }
            const conversations = await Conversation.find({
                "members._id": decodedToken.id
            }, { id: 1, members: 1, lastMessage: 1 })
            return res.status(200).json({ type: 'success', code: 0, conversations })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ type: 'error', code: 99, message: "Неизвестная ошибка. Попробуй позже" })
        }
    }
    sendMessage = async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token)
                return res.status(401).json({ type: 'error', code: 41, message: "Доступно только авторизованным пользователям!" })
            let decodedToken = undefined
            try {
                decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            } catch (e) {
                return res.status(401).json({ type: 'error', code: 41, message: "Необходима повторная авторизация!" })
            }
            const { conversation, text } = req.body
            if (!conversation.members.find(member => member._id === decodedToken.id))
                return res.status(403).json({ type: 'error', code: 43, message: "Нет доступа к этому диалогу!" })
            const newMessage = new Message({
                conversation: conversation._id,
                sender: {
                    _id: decodedToken.id,
                    username: decodedToken.username
                },
                text
            })
            await newMessage.save()
            await Conversation.findOneAndUpdate({ _id: newMessage.conversation }, {
                lastMessage: {
                    sender: newMessage.sender,
                    text: newMessage.text
                }
            })
            this.io.emit('NEW:MESSAGE', conversation.members)
            return res.status(200).json({ type: 'success', code: 0 })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ type: 'error', code: 99, message: "Неизвестная ошибка. Попробуй позже" })
        }
    }
    async getMessages(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token)
                return res.status(401).json({ type: 'error', code: 41, message: "Доступно только авторизованным пользователям!" })
            let decodedToken = undefined
            try {
                decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            } catch (e) {
                return res.status(401).json({ type: 'error', code: 41, message: "Необходима повторная авторизация!" })
            }
            const conversation = await Conversation.findOne({ _id: req.headers.conversation }, { members: 1 })
            if (!conversation.members.find(member => member._id === decodedToken.id))
                return res.status(403).json({ type: 'error', code: 43, message: "Нет доступа к этому диалогу!" })
            const messages = await Message.find({ conversation: conversation.id }, { id: 1, sender: 1, text: 1 })
            return res.status(200).json({ type: 'success', code: 0, messages })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ type: 'error', code: 99, message: "Неизвестная ошибка. Попробуй позже" })
        }
    }
    async changePassword(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token)
                return res.status(401).json({ type: 'error', code: 41, message: "Доступно только авторизованным пользователям!" })
            let decodedToken = undefined
            try {
                decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            } catch (e) {
                return res.status(401).json({ type: 'error', code: 41, message: "Необходима повторная авторизация!" })
            }
            const { currentPassword, newPassword } = req.body
            const user = await User.findOne({ _id: decodedToken.id })
            const validCurrentPassword = bcrypt.compareSync(currentPassword, user.password)
            if (!validCurrentPassword)
                return res.status(400).json({ type: 'error', code: 1, message: "Неверный текущий пароль!" })
            const hashNewPassword = bcrypt.hashSync(newPassword, 7)
            await User.findOneAndUpdate({
                _id: decodedToken.id
            }, {
                password: hashNewPassword,
                isActivated: true
            })
            await mailService.changePasswordNotification(user.email)
            return res.status(200).json({ type: 'success', code: 0, message: "Пароль был успешно изменен!" })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ type: 'error', code: 99, message: "Неизвестная ошибка. Попробуй позже" })
        }
    }
}

module.exports = MainController