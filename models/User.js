const { model, Schema } = require('mongoose')

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    badges: {
        type: Array
    }
})

module.exports = model('User', User)