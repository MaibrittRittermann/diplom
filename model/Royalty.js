const mongoose = require('mongoose');

const royaltySchema = mongoose.Schema({
    photo: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255
    },
    photographerId: {
        type: Number,
        required: true,
    },
    usage: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255
    },
    mediaType: {
        type: Number,
        required: true
    },
    useDate: {
        type: Date,
        required: true,
    }
});

const Royalty = mongoose.model('Royalty', royaltySchema);

module.exports.Royalty = Royalty;