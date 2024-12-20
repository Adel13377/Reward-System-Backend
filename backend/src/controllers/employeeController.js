const Employee = require('../models/Employee');
const evalidate = require('../middleware/evalidation');
const bcrypt = require('bcrypt');
const admin = require('../models/Users');

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
            username: req.body.username,
            email: req.body.email,
            points: req.body.points || 0,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phonenumber: req.body.phonenumber,
            department: req.body.department, 
            userId: req.user._id
        });
        user = await admin.findOne({ _id: employee.userId });
        employee.company = user.company;
        employee.password = await bcrypt.hash('P@ssw0rd2024', 10);
        console.log(employee);
        const errors = evalidate(employee);
        console.log(errors);
        if (Object.keys(errors).length > 0) {
            console.log(`Erroooooors: ${JSON.stringify(errors, null, 2)}`);
            return res.status(400).json({ errors });
        }
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

    editEmployee: async (req, res) => {
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
            const errors = evalidate(req.body);
            console.log(errors);
            if (Object.keys(errors).length > 0) {
                console.log(`Erroooooors: ${JSON.stringify(errors, null, 2)}`);
                return res.status(400).json({ errors });
            }
            employee.username = req.body.username;
            employee.firstname = req.body.firstname;
            employee.lastname = req.body.lastname;
            employee.email = req.body.email;
            employee.department = req.body.department;
            employee.points = req.body.points;
            employee.phonenumber = req.body.phonenumber;
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