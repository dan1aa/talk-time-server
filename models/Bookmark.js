const { model, Schema } = require('mongoose');

const Bookmark = new Schema({
    name: {
        type: String,
        required: true
    },
    bookmark: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

module.exports = model('Bookmark', Bookmark)