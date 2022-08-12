const { Schema, model } = require('mongoose')

const Quality = new Schema({
    quality: {
        type: String,
        required: true
    }
})

module.exports = model('Quality', Quality)