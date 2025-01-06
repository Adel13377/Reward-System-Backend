const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    thirdParty: { type: mongoose.Schema.Types.ObjectId, ref: 'ThirdPartyUser' },
    points: { type: Number, required: true },
    type: { type: String, enum: ['added', 'deducted'], required: true },
    description: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);