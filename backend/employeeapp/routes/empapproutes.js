const express = require('express');
const router = express.Router();
const generateqr = require('../controller/generateqrController');
const confirmation = require('../controller/confirmationController');
const { generateTransactionCode } = require('../controller/generateOfferCode');

router.post('/generate-qr', generateqr);
router.post('/confirmation', confirmation);
router.post('/generate-code', generateTransactionCode);

module.exports = router;