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
        type: Array,
        default: []
    },
    percents: {
        type: String,
        default: ''
    },
    age: {
        type: String,
        default: ''
    },
    techs: {
        type: Array,
        default: []
    }
})

module.exports = model('User', User)