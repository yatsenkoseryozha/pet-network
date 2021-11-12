const { Router } = require('express')
const AuthController = require('../controllers/auth-controller')

const authRouter = (io) => {
    const router = new Router()
    const authController = new AuthController(io)

    router.post('/registration', authController.registration)
    router.post('/login', authController.login)
    router.get('/', authController.auth)

    return router
}

module.exports = authRouter