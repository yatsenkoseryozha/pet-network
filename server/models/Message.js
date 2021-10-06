const {Schema, model} = require('mongoose')

const Message = new Schema({
    conversation: {type: String},
    sender: {type: Object},
    text: {type: String}
}, {timestamps: true})

module.exports = model('Message', Message)