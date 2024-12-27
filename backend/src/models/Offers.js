const mongoose = require('mongoose');
const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        default: 0 ,
        min: [0, 'Points cannot be negative'],
        required: false,
    },
    expiryDate: {
        type: Date, // Optional field
        required: false, // Not mandatory
    },
}, {
    timestamps: true,
});

offerSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Offer', offerSchema);