const Router = require('express')
const MainController = require('../controllers/main-controller')

const mainRouter = (io) => {
    const router = new Router()
    const mainController = new MainController(io)

    router.get('/get-conversations', mainController.getConversations)
    router.get('/get-users', mainController.getUsers)
    router.post('/create-conversation', mainController.createConversation)
    router.get('/get-messages', mainController.getMessages)
    router.post('/send-message', mainController.sendMessage)
    router.post('/change-password', mainController.changePassword)

    return router
}

module.exports = mainRouter