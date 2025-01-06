const QRCode = require('qrcode');

const generateqr = async(req, res) => {
    try {
        const { employeeId } = req.body;
        if (!employeeId) {
            return res.status(400).json({ message: 'Employee ID is required' });
        }
        const payload = { employeeId };
        const Qrcode = await QRCode.toDataURL(JSON.stringify(payload));
        res.status(200).json({ Qrcode });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ message: error.message });
    }   
}

module.exports = generateqr;