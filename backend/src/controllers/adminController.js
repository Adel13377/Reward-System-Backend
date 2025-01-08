const bcrypt = require('bcrypt');
const admin = require('../models/Users');
const validatepass = require('../middleware/validatepass');

const changePassword = async (req, res) => {
        try {
            const Admin = await admin.findOne({
                _id: req.user._id,
            });
            if (!Admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            const verify = await bcrypt.compare(req.body.oldpass, Admin.password);
            const errors = await validatepass(req.body);
            if (Object.keys(errors).length > 0) {
                console.log(`Erroooooors: ${JSON.stringify(errors, null, 2)}`);
                return res.status(400).json({ errors });
            }
            if (!verify) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }

            Admin.password = await bcrypt.hash(req.body.password, 10);
            const updatedAdmin = await Admin.save();
            res.json(updatedAdmin);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
module.exports = { changePassword };