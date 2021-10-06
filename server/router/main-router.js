const Router = require('express')
const router = new Router()
const mainController = require('../controllers/main-controller')
const settingsController = require('../controllers/settings-controller')

router.get('/get-conversations', mainController.getConversations)
router.get('/get-users', mainController.getUsers)
router.post('/create-conversation', mainController.createConversation)
router.get('/get-messages', mainController.getMessages)
router.post('/send-message', mainController.sendMessage)

router.post('/change-password', settingsController.changePassword)

module.exports = router