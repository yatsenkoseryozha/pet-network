require('dotenv').config()

const express = require('express')
const { createServer } = require('http')
const socket = require('socket.io')
const mongoose = require('mongoose')
const cors = require('cors')
const authRouter = require('./router/auth-router')
const mainRouter = require('./router/main-router')

const app = express()
const httpServer = createServer(app)
const io = socket(httpServer)

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/auth', authRouter(io))
app.use('/', mainRouter(io))

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}...`))
    } catch (e) {
        console.log(e)
    }
}

start()