const { model, Schema } = require('mongoose')

const Feedback = new Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    file: {
        type: String
    },
    senderImg: {
        type: String,
        required: true
    },
    feedbackImg: {
        type: String
    },
    date: {
        type: String,
        required: true
    },
    comments: {
        type: Array
    }
})

module.exports = model('Feedback', Feedback)