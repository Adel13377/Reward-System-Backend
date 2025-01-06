const pendaingtansaction = require('../../src/models/PendingTransaction');

const scanqr = async (req, res) => {
    try {
        const { QrData, thirdpartyId, price } = req.body;
        console.log('QrData:', QrData);
        // const { employeeId } = JSON.parse(QrData);
        const employeeId = QrData;
        console.log('EmployeeId:', employeeId);
        const PendingTransaction = new pendaingtansaction({
            employee: employeeId,
            thirdParty: thirdpartyId,
            points: price,
            status: 'pending'
        });

        await PendingTransaction.save();
        return res.status(200).json("Transaction created successfully. waiting for employee confirmation.");

    } catch (err) {
        console.error('Error scanning QR code:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = scanqr;