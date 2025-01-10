const Users = require('../models/Users');
const bcrypt = require('bcrypt');
const validateSignup = require('../middleware/validation');
const thirdparty = require('../models/ThirdPartUsers');
const evalidate = require('../middleware/evalidation');

const getadmin = async (req, res) => {
    try {
        const prevlige = req.user.role;
        if (prevlige !== 'superadmin') {
            return res.status(403).json({ message: 'You are not authorized to perform this action' });
        }
        const admin = await Users.find();
        console.log(admin);
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const editadmin = async (req, res) => {
    try {
        const prevlige = req.user.role;
        if (prevlige !== 'superadmin') {
            return res.status(403).json({ message: 'You are not authorized to perform this action' });
        }

        const admin = await Users.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const errors = await validateSignup(req.body, req.params.id);
        if (Object.keys(errors).length > 0) {
            console.log(`Erroooooors: ${JSON.stringify(errors, null, 2)}`);
            return res.status(400).json({ errors });
        }
        admin.username = req.body.username;
        admin.firstname = req.body.firstname;
        admin.lastname = req.body.lastname;
        admin.phonenumber = req.body.phonenumber;
        admin.company = req.body.company;
        const updatedAdmin = await admin.save();
        res.json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const resetpass = async (req, res) => {
    try {
        const prevlige = req.user.role;
        if (prevlige !== 'superadmin') {
            return res.status(403).json({ message: 'You are not authorized to perform this action' });
        }
        const admin = await Users.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        admin.password = await bcrypt.hash("P@ssw0rd2024", 10);
        const updatedAdmin = await admin.save();
        res.json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteAdmin = async (req, res) => {
    try {
        const prevlige = req.user.role;
        if (prevlige !== 'superadmin') {
            return res.status(403).json({ message: 'You are not authorized to perform this action' });
        }
        const admin = await Users.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const Employee = require('../models/Employee'); // Import the Employee model
        await Employee.deleteMany({ userId: admin._id });
        await admin.deleteOne();
        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

  const searchAdmin = async (req, res) => {
        try {
            const query = req.query.q;
            const isNumber = !isNaN(query); // Check if the query is a number

            const admins = await Users.find({
                $or: [
                    { username: { $regex: req.query.q, $options: 'i' } },
                    { email: { $regex: req.query.q, $options: 'i' } },
                    { firstname: { $regex: req.query.q, $options: 'i' } },
                    { lastname: { $regex: req.query.q, $options: 'i' } },
                    { company: { $regex: req.query.q, $options: 'i' } },
                    ...(isNumber ? [{ phonenumber: Number(query) }] : [])
                ]
            });
            res.json(admins);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

const createThirdParty = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }
        const errors = await evalidate(req.body);
        if (Object.keys(errors).length > 0) {
            console.log(`Erroooooors: ${JSON.stringify(errors, null, 2)}`);
            return res.status(400).json({ errors });
        }
        password = await bcrypt.hash(req.body.password, 10);
        const newthirdparty = new thirdparty({
            username: req.body.username,
            password: password,
            phonenumber: req.body.phonenumber,
            email: req.body.email,
            industryType: req.body.industrytype,
            imageUrl: `/third/${req.file.filename}`,
            website: req.body.website,
        });

        const savedthirdparty = await newthirdparty.save();
        res.status(201).json(savedthirdparty);
} catch (error) {
        res.status(500).json({ message: error.message });
}
}

const getThirdParties = async (req, res) => {
    try {
        const thirdparties = await thirdparty.find();
        res.json(thirdparties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

 const getThirdParty = async (req, res) => {
    try {
        const thirdpart = await thirdparty.findById(req.user._id);
        if (!thirdpart) {
            return res.status(404).json({ message: 'Third party not found' });
        }
        res.json(thirdpart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
 }

const deleteThirdparties = async (req, res) => {
    try {
        console.log(req.params.id);
        const thirdpart = await thirdparty.findById(req.params.id);
        console.log(thirdpart);
        if (!thirdpart) {
            return res.status(404).json({ message: 'Third party not found' });
        }
        await thirdpart.deleteOne();
        res.json({ message: 'Third party deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const resetpassthird = async (req, res) => {
    try {
        const thirdpart = await thirdparty.findById(req.params.id);
        if (!thirdpart) {
            return res.status(404).json({ message: 'Third party not found' });
        }
        thirdpart.password = await bcrypt.hash("P@ssw0rd2024", 10);
        const updatedThirdParty = await thirdpart.save();
        res.json(updatedThirdParty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const edittingThirdParty = async (req, res) => {
    try {
        console.log(req.params.id);
        const thirdpart = await thirdparty.findById(req.params.id);
        console.log(thirdpart);
        if (!thirdpart) {
            return res.status(404).json({ message: 'Third party not found' });
        }
        const errors = await evalidate(req.body, req.params.id);
        if (Object.keys(errors).length > 0) {
            console.log(`Erroooooors: ${JSON.stringify(errors, null, 2)}`);
            return res.status(400).json({ errors });
        }
        thirdpart.password = await bcrypt.hash(req.body.password, 10);
        thirdpart.points = req.body.points;
        thirdpart.username = req.body.username;
        thirdpart.email = req.body.email;
        thirdpart.phonenumber = req.body.phonenumber;
        thirdpart.industryType = req.body.industrytype;
        thirdpart.website = req.body.website;

        console.log(thirdpart);
        const updatedThirdParty = await thirdpart.save();
        console.log(updatedThirdParty);
        res.json(updatedThirdParty);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const searchThirdParty = async (req, res) => {
    try {
        const query = req.query.q;
        const isNumber = !isNaN(query); // Check if the query is a number

        const thirdparties = await thirdparty.find({
            $or: [
                { username: { $regex: req.query.q, $options: 'i' } },
                { email: { $regex: req.query.q, $options: 'i' } },
                { industryType: { $regex: req.query.q, $options: 'i' } },
                ...(isNumber ? [{ phonenumber: Number(query) }] : [])
            ]
        });
        res.json(thirdparties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getThirdParty, searchThirdParty, searchAdmin, resetpassthird, edittingThirdParty, deleteThirdparties, getadmin, editadmin, deleteAdmin, resetpass, createThirdParty, getThirdParties };