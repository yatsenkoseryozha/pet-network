const {Schema, model} = require('mongoose')

const Conversation = new Schema({
    members: {type: Array},
    lastMessage: {
        type: {
            sender: {type: String},
            text: {type: String}
        }, 
        default: null
    }
}, {timestamps: true})

module.exports = model('Conversation', Conversation)