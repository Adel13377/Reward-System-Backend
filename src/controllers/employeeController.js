const Employee = require('../models/Employee');

const employeeController = {
    // Get all employees
    getAllEmployees: async (req, res) => {
        try {
            const employees = await Employee.find();
            res.json(employees);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get single employee
    getEmployeeById: async (req, res) => {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            res.json(employee);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create new employee
    createEmployee: async (req, res) => {
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
    },

    // Update employee points
    updatePoints: async (req, res) => {
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
    },

    // Delete employee
    deleteEmployee: async (req, res) => {
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
    }
};

module.exports = employeeController;