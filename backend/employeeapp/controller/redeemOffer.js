const TransactionCode = require('../../src/models/TransactionCode');
const Employee = require('../../src/models/Employee');
const Offer = require('../../src/models/Offers');
const { transactions } = require('../middleware/transactions');

const redeemOffer = async (req, res) => {
    try {
        const thirdPartyId = req.user._id;
        const code = req.body.code;
        const transactionCode = await TransactionCode.findOne({ code, thirdPartyId:thirdPartyId, used: false });
        console.log('Transaction code:', code);
        console.log('Third party ID:', thirdPartyId);
        console.log('Transaction code:', transactionCode);
        if (!transactionCode) {
            return res.status(403).json({ message: 'Invalid or already used code'});
        }

        const { employeeId, offerId } = transactionCode;

        // Find employee and offer
        const employee = await Employee.findById(employeeId);
        const offer = await Offer.findById(offerId);

        if (!employee || !offer) {
            return res.status(404).json({ message: 'offer or employee not found' });
        }

        // Check if employee has enough points
        const success = transactions(employeeId, thirdPartyId, offer.points);
        if (!success) {
            response.status(403).json({ message: 'error in transaction middleware' });
        }
        // Mark the code as used
        transactionCode.used = true;
        await transactionCode.save();

        console.log('Transaction successful');
        return res.status(200).json({ message: 'Transaction confirmed successfully' });
    } catch (error) {
        console.error('Error reddeming offer:', error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { redeemOffer };