const mongoose = require('mongoose');
const Transaction = require('./Transactions');

const pendingTransactionSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    thirdParty: { type: mongoose.Schema.Types.ObjectId, ref: 'ThirdPartyUser', required: true },
    points: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PendingTransaction', pendingTransactionSchema);