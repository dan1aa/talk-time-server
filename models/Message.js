const { Schema, model } = require('mongoose');

const Message = new Schema({
    text: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

module.exports = model('Message', Message)