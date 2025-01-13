const transactionCode = require('../../src/models/TransactionCode');
const Offer = require('../../src/models/Offers');
const Employee = require('../../src/models/Employee');

const getofferstransactions = async (req, res) => {
    try {

        const transactionCodee = await transactionCode.find().lean();
        const update = [];
        for (const transaction of transactionCodee) {
            const offer = await Offer.findById(transaction.offerId).lean();
            const employee = await Employee.findById(transaction.employeeId).lean();
            const newd = {
                offer: offer ? offer.title : null,
                user: employee ? employee.username : null,
            }
            update.push(newd);
        }
        return res.status(200).json(update);
    } catch (err) {
        console.error('Error getting transaction codes:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = getofferstransactions;