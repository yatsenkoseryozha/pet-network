const {Schema, model} = require('mongoose')

const Conversation = new Schema({
    members: {type: Array},
    lastMessage: {type: Object}
}, {timestamps: true})

module.exports = model('Conversation', Conversation)