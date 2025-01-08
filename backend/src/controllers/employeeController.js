const Employee = require('../models/Employee');
const validateSignup = require('../middleware/validation');
const bcrypt = require('bcrypt');
const admin = require('../models/Users');
const Transactions = require('../models/Transactions');
const { request } = require('express');

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
            const employeeid = req.user._id;
            if (!employeeid) {
                return res.status(404).json({ message: "couldn't find the employee" });
            }
            const employee = await Employee.find({
                _id: employeeid
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
        try {
            const adminUser = await admin.findById(req.user._id); // Assuming req.user is already populated with admin user info
    
            const employeeData = {
                username: req.body.username,
                email: req.body.email,
                points: req.body.points || 0,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phonenumber: req.body.phonenumber,
                department: req.body.department,
                userId: adminUser._id,
                company: adminUser.company,
                password: 'P@ssw0rd2024', // Using plain text password here for validation; will hash later
            };

            // Validate employee data
            const errors = await validateSignup(employeeData);
            if (Object.keys(errors).length > 0) {
                console.log(`Validation Errors: ${JSON.stringify(errors, null, 2)}`);
                return res.status(400).json({ errors });
            }
    
            // Create and save employee after validation
            const employee = new Employee({
                ...employeeData,
                password: await bcrypt.hash(employeeData.password, 10), // Hash password before saving
            });
    
            const newEmployee = await employee.save();
            res.status(201).json(newEmployee);
        } catch (error) {
            console.error('Error creating employee:', error.message);
            res.status(500).json({ message: error.message });
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

            const errors = await validateSignup(req.body, employee._id);
            if (Object.keys(errors).length > 0) {
                console.log(`Erroooooors: ${JSON.stringify(errors, null, 2)}`);
                return res.status(400).json({ errors });
            }
            if (employee.points !== req.body.points) {
                var oldP = employee.points;
            }
            employee.username = req.body.username;
            employee.firstname = req.body.firstname;
            employee.lastname = req.body.lastname;
            employee.email = req.body.email;
            employee.department = req.body.department;
            employee.points = req.body.points;
            employee.phonenumber = req.body.phonenumber;
            employee.pushToken = req.body.pushToken;
            const updatedEmployee = await employee.save();
            if (oldP < employee.points) {
                const newTransaction = new Transactions({
                    employee: employee._id,
                    points: employee.points - oldP,
                    type: 'added',
                });
                await newTransaction.save();
            }
            if (employee.points < oldP) {
                const newTransaction = new Transactions({
                    employee: employee._id,
                    points: oldP - employee.points,
                    type: 'deducted',
                });
                await newTransaction.save();
            }

            res.json(updatedEmployee);
        } catch (error) {
            res.status(400).json({ message: error.message });
    }
},

    resetpassword: async (req, res) => {
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

            employee.password = await bcrypt.hash("P@ssw0rd2024", 10);
            const updatedEmployee = await employee.save();
            res.json(updatedEmployee);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    changePassword: async (req, res) => {
        try {
            const employee = await Employee.findOne({
                _id: req.params.id,
            });
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            const verify = await bcrypt.compare(req.body.oldpass, employee.password);

            if (!verify) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }

            employee.password = await bcrypt.hash(req.body.password, 10);
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
    },

    searchEmployee: async (req, res) => {
        try {
            const adminid = req.user._id;
            if (!adminid) {
                return res.status(404).json({ message: "couldn't find your employees" });
            }

            const query = req.query.q;
            const isNumber = !isNaN(query); // Check if the query is a number

            const employees = await Employee.find({
                userId: adminid,
                $or: [
                    { username: { $regex: req.query.q, $options: 'i' } },
                    { email: { $regex: req.query.q, $options: 'i' } },
                    { firstname: { $regex: req.query.q, $options: 'i' } },
                    { lastname: { $regex: req.query.q, $options: 'i' } },
                    { department: { $regex: req.query.q, $options: 'i' } },
                    ...(isNumber ? [{ phonenumber: Number(query) }] : [])
                ]
            });
            res.json(employees);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = employeeController;