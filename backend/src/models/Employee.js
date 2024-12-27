const mongoose = require('mongoose');


const employeeSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    points: { type: Number, default: 0 ,  min: [0, 'Points cannot be negative']},
    department: String,
    firstname: { type: String, required: true},
    lastname: { type: String, required: true},
    phonenumber: { type: Number, required: true },
    joinDate: { type: Date, default: Date.now },
    company: { type: String, ref: 'Users', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }
});

module.exports = mongoose.model('Employee', employeeSchema);