const Employee = require('../models/Employee');

const employeeController = {
    // Get all employees
    getAllEmployees: async (req, res) => {
        try {
            console.log(req.user);
            const adminid = req.user._id;
            if (!adminid) {
                return res.status(404).json({ message: "couldn't find your employees" });
            }
            console.log(adminid);
            const employees = await Employee.find({userId: adminid});
            res.json(employees);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get single employee
    getEmployeeById: async (req, res) => {
        try {
            const adminid = req.user._id;
            if (!adminid) {
                return res.status(404).json({ message: "couldn't find your employees" });
            }
            const employee = await Employee.find({
                _id: req.params.id,
                userId: adminid
            });
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
            department: req.body.department,
            userId: req.user._id
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
            const adminid = req.user._id;
            if (!adminid) {
                return res.status(404).json({ message: "couldn't update this employee" });
            }
            const employee = await Employee.findOne({
                _id: req.params.id,
                userId: adminid
            });
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
            const adminid = req.user._id;
            if (!adminid) {
                return res.status(404).json({ message: "couldn't find your employees" });
            }
            const employee = await Employee.findById({
                _id: req.params.id,
                userId: adminid
            });
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