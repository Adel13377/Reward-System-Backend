const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/rewardPoints', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Employee Schema
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 },
    department: String,
    joinDate: { type: Date, default: Date.now }
});

const Employee = mongoose.model('Employee', employeeSchema);

// Routes

// Get all employees
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single employee
app.get('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new employee
app.post('/api/employees', async (req, res) => {
    const employee = new Employee({
        name: req.body.name,
        email: req.body.email,
        points: req.body.points || 0,
        department: req.body.department
    });

    try {
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update employee points
app.patch('/api/employees/:id/points', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.points = req.body.points;
        const updatedEmployee = await employee.save();
        res.json(updatedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await employee.deleteOne();
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});