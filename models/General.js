const { Schema, model } = require('mongoose')
const General = new Schema({
    name: {
        type: String,
        required: true
    },
    meetings: {
        type: Array,
        default: []
    },
    date: {
        type: String,
        default: ''
    }
})

module.exports = model('General', General)