const pendaingtansaction = require('../../src/models/PendingTransaction');
const employee = require('../../src/models/Employee');
const thirdparty = require('../../src/models/ThirdPartUsers');
const Transaction = require('../../src/models/Transactions');
const ThirdPTransaction = require('../../src/models/ThirdPTrasactions');

const confrimTransaction = async (req, res) => {
    try {
        const { transactionId, confirm } = req.body;
        console.log("transactionId: " + transactionId);
        const transaction = await pendaingtansaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        // if (transaction.status !== 'pending') {
        //     return res.status(400).json({ message: 'Transaction is already confirmed or rejected' });
        // }
        if (confirm) {
            const Employee = await employee.findById(transaction.employee);
            const Thirdparty = await thirdparty.findById(transaction.thirdParty);
            if (!Employee || !Thirdparty) {
                return res.status(404).json({ message: 'Employee or third party not found' });
            }
            if (Employee.points < transaction.points) {
                return res.status(400).json({ message: 'Insufficient points' });
            }
            Employee.points -= transaction.points;
            Thirdparty.points += transaction.points;

            await Employee.save();
            await Thirdparty.save();

            transaction.status = 'confirmed';
            console.log(transaction);
            const newtransaction = new Transaction({
                employee: transaction.employee,
                thirdParty: transaction.thirdParty,
                points: transaction.points,
                type: 'deducted',
            });
            console.log(newtransaction);
            const thirdptransaction = new ThirdPTransaction({
                employee: Employee.firstname + ' ' + Employee.lastname,
                points: transaction.points,
                description: transaction.description,
            })
            await newtransaction.save();
            await thirdptransaction.save();
            await transaction.deleteOne();
            return res.status(200).json({ message: 'Transaction confirmed successfully' });
        } else {
            transaction.status = 'rejected';
            await transaction.deleteOne();
            return res.status(200).json({ message: 'Transaction rejected successfully' });
        }
        // Confirm transaction
        // const transaction = await Transaction.findById(transaction
    } catch (error) {
        console.error('Error confirming transaction:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = confrimTransaction;