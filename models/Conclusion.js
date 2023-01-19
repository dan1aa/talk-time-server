const { model, Schema } = require('mongoose');

const Conclusion = new Schema({
    text: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    important: {
        type: Boolean,
        default: false
    },
    tags: {
        type: Array,
        default: []
    }
})

module.exports = model('Conclusion', Conclusion)