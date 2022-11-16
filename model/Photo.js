const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255
    },
    photographer: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 255
    },
    photographerId: {
        type: Number,
        required: true,
    },
    url: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    labels: {
        type: [String]
    },
    untrained: {
        type: Boolean,
        default: false
    }
});

const Photo = mongoose.model('Photos', photoSchema);

module.exports.Photo = Photo;
