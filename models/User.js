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
        type: Array,
        default: []
    },
    peaks: {
        type: Array
    },
    percents: {
        type: String
    }
})

module.exports = model('User', User)