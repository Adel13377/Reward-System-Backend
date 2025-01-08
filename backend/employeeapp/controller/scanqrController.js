const pendaingtansaction = require('../../src/models/PendingTransaction');
const io = require('../../src/app');
const thirdParty = require('../../src/models/ThirdPartUsers');

const scanqr = async (req, res) => {
    try {
        const { QrData, thirdpartyId, price } = req.body;
        console.log('QrData:', QrData);
        // const  employeeId  = JSON.parse(QrData);
        const employeeId = QrData;
        console.log('EmployeeId:', employeeId);
        const PendingTransaction = new pendaingtansaction({
            employee: employeeId,
            thirdParty: thirdpartyId,
            points: price,
            status: 'pending'
        });

        await PendingTransaction.save();

        const third = await thirdParty.findById(thirdpartyId);

        // io.emit(`transaction:${employeeId}`, {
        //     transactionId: PendingTransaction._id,
        //     price,
        //     thirdparty: third.username,
        //     message: `A new transaction from ${third.username} with ${price} points is waiting for your confirmation.`
        // });

        return res.status(200).json("Transaction created successfully. waiting for employee confirmation.");

    } catch (err) {
        console.error('Error scanning QR code:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = scanqr;