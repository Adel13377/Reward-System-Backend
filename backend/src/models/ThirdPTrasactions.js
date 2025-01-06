const mongoose = require('mongoose');

const thirdptransactionSchema = new mongoose.Schema({
    employee: { type: String, required: true },
    points: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ThirdPTransaction', thirdptransactionSchema);