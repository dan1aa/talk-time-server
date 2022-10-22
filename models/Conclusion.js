const { model, Schema } = require('mongoose');

const Conclusion = new Schema({
    text: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

module.exports = model('Conclusion', Conclusion)