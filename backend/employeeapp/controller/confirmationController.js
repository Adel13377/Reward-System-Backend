const pendaingtansaction = require('../../src/models/PendingTransaction');
const employee = require('../../src/models/Employee');
const thirdparty = require('../../src/models/ThirdPartUsers');
const Transaction = require('../../src/models/Transactions');
const ThirdPTransaction = require('../../src/models/ThirdPTrasactions');
const { transactions } = require('../middleware/transactions');

const confrimTransaction = async (req, res) => {
    try {
        const { transactionId, confirm } = req.body;
        console.log("transactionId: " + transactionId);
        const transaction = await pendaingtansaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        if (transaction.status !== 'pending') {
            return res.status(400).json({ message: 'Transaction is already confirmed or rejected' });
        }
        const thirdpartyId = transaction.thirdParty;
        if (confirm) {
            const seccess = transactions(transaction.employee, transaction.thirdParty, transaction.points);
            if (!seccess) {
                response.status(403).json({ message: 'error in transaction middleware' });
            }
            await transaction.deleteOne();
            // io.emit(`transaction:${thirdpartyId}`, { status: 'confirmed', message: 'Transaction confirmed.' });
            return res.status(200).json({ message: 'Transaction confirmed successfully' });
        } else {
            transaction.status = 'rejected';
            await transaction.deleteOne();

            // io.emit(`transaction:${thirdpartyId}`, { status: 'rejected', message: 'Transaction rejected.' });
            
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