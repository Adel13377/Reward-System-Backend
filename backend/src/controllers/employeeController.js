const Employee = require('../models/Employee');
const validateSignup = require('../middleware/validation');
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
                _id: adminid
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
            console.log(adminUser);
            console.log(adminUser.company);
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
            console.log(req.body);
            const errors = await validateSignup(req.body, employee._id);
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