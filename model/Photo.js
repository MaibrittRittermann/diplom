const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255
    },
    url: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255,
        unique: true
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
    labels: {
        type: [String]
    },
});

const Photo = mongoose.model('Photos', photoSchema);

module.exports.Photo = Photo;
