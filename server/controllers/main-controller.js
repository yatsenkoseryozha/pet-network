const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Conversation = require('../models/Conversation')
const Message = require('../models/Message')

class mainController {
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
                throw res.status(401).json({message: "Пользователь не авторизован!"})
            const decodedToken = jwt.verify(token, process.env.SECRET)
            const receiver = await User.findOne({ _id: req.body.receiver })
            const newConversation = new Conversation({
                members: [
                    {
                        id: decodedToken.id,
                        username: decodedToken.username
                    }, 
                    {
                        id: receiver.id,
                        username: receiver.username
                    }
                ]
            })
            await newConversation.save()
            return res.status(200).json({ message: "Беседа создана!" })
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
            return res.status(200).json({ messages})
        } catch (err) {
            console.log(err)
        }
    }
    async sendMessage(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token)
                return res.status(401).json({message: "Пользователь не авторизован!"})
            const decodedToken = jwt.verify(token, process.env.SECRET)
            let { conversation, text } = req.body
            if (!conversation.id) {
                const newConversation = new Conversation({
                    members: conversation.members
                })
                await newConversation.save()
                conversation = newConversation
            }
            await Conversation.findOneAndUpdate({ _id: conversation.id }, {
                lastMessage: { sender: decodedToken.username, text }
            })
            const newMessage = new Message({ 
                conversation: conversation.id, 
                sender: {
                    id: decodedToken.id,
                    username: decodedToken.username
                }, 
                text 
            })
            await newMessage.save()
            return res.status(200).json({ message: "Сообщение отправлено!" })
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = new mainController()