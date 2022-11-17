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
    userId: {
        type: Number,
        required: true
    },
    channel: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255
    },
    mediaType: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 255
    },
    useDate: {
        type: Date,
        required: true,
    }
});

const Royalty = mongoose.model('Royalty', royaltySchema);

module.exports.Royalty = Royalty;