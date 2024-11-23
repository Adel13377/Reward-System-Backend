const Users = require('../models/Users');

const getadmin = async (req, res) => {
    try {
        console.log(req.user);
        const adminid = req.user._id;
        if (!adminid) {
            return res.status(404).json({ message: "couldn't find your employees" });
        }
        console.log(adminid);
        const admin = await Users.find({_id: adminid});
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = getadmin;