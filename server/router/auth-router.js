const Router = require('express')
const router = new Router()
const authController = require('../controllers/auth-controller')
const {check} = require('express-validator')

router.post('/registration', [
    check('username', "Неправильное имя пользователя").notEmpty(),
], authController.registration)
router.post('/login', authController.login)
router.get('/', authController.auth)

module.exports = router  