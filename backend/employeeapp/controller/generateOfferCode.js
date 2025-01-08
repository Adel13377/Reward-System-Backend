const TransactionCode = require('../../src/models/TransactionCode');
const Employee = require('../../src/models/Employee');
const Offer = require('../../src/models/Offers');

const generateTransactionCode = async (req, res) => {
    try {
        const employeeId = req.user._id;
        const { offerId } = req.body;

        const found = await TransactionCode.findOne({ offerId, employeeId });

        if (found) {
            const fcode = found.code;
            return res.json({ fcode });
        }
        // Validate inputs
        if (!offerId) {
            return res.status(400).json({ message: 'Offer ID is required' });
        }

        // Find employee and offer
        const employee = await Employee.findById(employeeId);
        const offer = await Offer.findById(offerId);

        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (offer.points > employee.points) {
            return res.status(400).json({ message: 'Insufficient points' });
        };
        const thirdPartyId = offer.thirdPartyId;

        // Generate a unique 8-character code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 10; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Save the code to the database
        const transactionCode = new TransactionCode({
            code,
            employeeId,
            offerId,
            thirdPartyId,
            points: offer.points
        });

        await transactionCode.save();

        // Return the generated code
        return res.status(201).json({ code });
    } catch (error) {
        console.error('Error generating transaction code:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { generateTransactionCode };