const express = require('express');
const router = express.Router();
const scanqr = require('../controller/scanqrController');

router.post('/scan-qr', scanqr);

module.exports = router;