const Transactions = require('../models/Transactions');
const Employee = require('../models/Employee');
const ThirdParty = require('../models/ThirdPartUsers');

const getTransactionsById = async (req, res) => {
    try {
        const transactions = await Transactions.find({ employee: req.params.id }).lean();
        const employeee = await Employee.findById(req.params.id).lean();
        for (let transaction of transactions) {
            // const employee = await Employee.findById(transaction.employee);
            if (transaction.thirdParty) {
                const thirdParty = await ThirdParty.findById(transaction.thirdParty);
                transaction.thirdParty = thirdParty.username || null;
            }
        transaction.employee = `${employeee.firstname} ${employeee.lastname}`;

        console.log(transaction.employee);
    }
    
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getTransactionsById
};