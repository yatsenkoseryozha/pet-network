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
                "members.id": { 
                    $in: [ decodedToken.id ]
                }
            })
            let clearConversations = []
            conversations.map(conversation => {
                let clearConversation = {
                    id: conversation._id,
                    members: conversation.members,
                    lastMessage: {
                        id: conversation.lastMessage._id,
                        sender: conversation.lastMessage.sender,
                        text: conversation.lastMessage.text
                    }
                }
                clearConversations.push(clearConversation)
            })
            return res.status(200).json({ conversations: clearConversations })
        } catch (err) {
            console.log(err)
        }
    }
    async getUsers(req, res) {
        try {
            const username = req.headers.username
            if (!username) 
                return res.status(200).json({ users: [] })
            const users = await User.find({username: { $regex : username } })
            let clearUsers = []
            users.map(user => {
                let clearUser = {
                    id: user._id,
                    username: user.username
                }
                clearUsers.push(clearUser)
            })
            return res.status(200).json({ users: clearUsers })
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
            try {
                jwt.verify(token, process.env.SECRET)
            } catch (err) {
                return res.status(401).json({ message: "Ошибка аутентификации!" })
            }
            const conversation = req.headers.conversation
            const messages = await Message.find({ conversation })
            let clearMessages = []
            messages.map(message => {
                let clearMessage = {
                    id: message._id,
                    sender: message.sender,
                    text: message.text
                }
                clearMessages.push(clearMessage)
            })
            return res.status(200).json({ messages: clearMessages })
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