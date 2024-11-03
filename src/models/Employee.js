const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 },
    department: String,
    joinDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', employeeSchema);