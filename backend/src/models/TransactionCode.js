const mongoose = require('mongoose');

const transactionCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // Generated code
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
    thirdPartyId: { type: mongoose.Schema.Types.ObjectId, ref: 'ThirdParty', required: true },
    createdAt: { type: Date, default: Date.now },
    points: { type: Number, required: true },
    used: { type: Boolean, default: false }, // To track if the code is already used
});

module.exports = mongoose.model('TransactionCode', transactionCodeSchema);