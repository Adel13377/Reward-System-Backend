const mongoose = require('mongoose');

// Define the schema for the superadmin collection
const thirdPartySchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUrl: { type: String, required: true },
    phonenumber: { type: Number, required: true },
    points: { type: Number, default: 0 , min: [0, 'Points cannot be negative'], required: false},
    industryType: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    website: { type: String, required: false },
});

// Create and export the model
const ThirdParty = mongoose.model('ThirdParty', thirdPartySchema);

module.exports = ThirdParty;