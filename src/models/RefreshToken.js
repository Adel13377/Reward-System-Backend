const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' } // Automatically deletes after 7 days
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);