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
                return res.status(401).json({message: "Пользователь не авторизован!"})
            const decodedToken = jwt.verify(token, process.env.SECRET)
            const username = req.headers.username
            const users = await User.find({
                $and: [
                    {username: { 
                        $regex : `^${username}`, $options: 'i'
                    }},
                    {username: { 
                        $nin: decodedToken.username
                    }},
                ]
            }, {id: 1, username: 1})
            return res.status(200).json({ users })
        } catch (err) {
            console.log(err)
        }
    }
    async createConversation(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token)
                return res.status(401).json({message: "Пользователь не авторизован!"})
            const conversation = new Conversation({ members: req.body.members })
            await conversation.save()
            return res.status(200).json({ conversation, message: "Беседа создана!" })
        } catch (err) {
            console.log(err)
        }
    }
    async getConversations(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token)
                return res.status(401).json({message: "Пользователь не авторизован!"})
            const decodedToken = jwt.verify(token, process.env.SECRET)
            const conversations = await Conversation.find({
                "members._id": { 
                    $in: [ decodedToken.id ]
                }
            }, { id: 1, members: 1, lastMessage: 1 })
            return res.status(200).json({ conversations })
        } catch (err) {
            console.log(err)
        }
    }
    sendMessage = async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token)
                return res.status(401).json({message: "Пользователь не авторизован!"})
            const decodedToken = jwt.verify(token, process.env.SECRET)
            let { conversation, text } = req.body
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
            return res.status(200).json({ message: "Сообщение отправлено!" })
        } catch (err) {
            console.log(err)
        }
    }
    async getMessages(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token)
                return res.status(401).json({ message: "Пользователь не авторизован!" })
            const decodedToken = jwt.verify(token, process.env.SECRET)
            const conversation = await Conversation.findOne({ _id: req.headers.conversation }, { members: 1 })
            if (!conversation.members.find(member => member._id === decodedToken.id))
                return res.status(403).json({ message: "Нет доступа!" })
            const messages = await Message.find({ conversation: conversation.id }, { id: 1, sender: 1, text: 1 })
            return res.status(200).json({ messages })
        } catch (err) {
            console.log(err)
        }
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
            await mailService.changePasswordNotification(user.email)
            return res.status(200).json({message: "Пароль успешно изменен!"})
        } catch(e) {
            console.log(e)
            return res.status(400).json({message: "Не удалось сменить пароль!"})
        }
    }
}

module.exports = MainController