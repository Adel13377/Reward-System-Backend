const transactions = require('../../src/models/Transactions');
const Employee = require('../../src/models/Employee');
const thirdptransactions = async (req, res) => {
    try {
        const thirdPartyId = req.user._id;
        const transactionss = await transactions.find({ thirdParty: thirdPartyId }).lean();
        const update = [];
        for (const transaction of transactionss) {
            const employee = await Employee.findById(transaction.employee).lean();
            const newd = {
                user: employee ? employee.firstname+' '+employee.lastname : null,
                points: transaction.points,
                description: transaction.description,
                date: transaction.date
            }
            update.push(newd);
        }
        return res.status(200).json(update);
    } catch (err) {
        console.error('Error getting transactions:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { thirdptransactions };