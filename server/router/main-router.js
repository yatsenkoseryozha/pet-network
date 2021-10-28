const Router = require('express')
const MainController = require('../controllers/main-controller')
const SettingsController = require('../controllers/settings-controller')

const mainRouter = (io) => {
    const router = new Router()
    const mainController = new MainController(io)
    const settingsController = new SettingsController(io)

    router.get('/get-conversations', mainController.getConversations)
    router.get('/get-users', mainController.getUsers)
    router.post('/create-conversation', mainController.createConversation)
    router.get('/get-messages', mainController.getMessages)
    router.post('/send-message', mainController.sendMessage)

    router.post('/change-password', settingsController.changePassword)

    return router
}

module.exports = mainRouter