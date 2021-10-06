const {Schema, model} = require('mongoose')

const User = new Schema({
    email: {type: String, unique: true, required: true},
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false}
}, {timestamps: true})

module.exports = model('User', User)