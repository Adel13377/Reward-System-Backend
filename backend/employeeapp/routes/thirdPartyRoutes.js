const express = require('express');
const router = express.Router();
const scanqr = require('../controller/scanqrController');
const { getThirdParty } = require('../../src/controllers/superAdminController');
const { redeemOffer } = require('../controller/redeemOffer');
const { thirdptransactions } = require('../controller/thirdptransactions');

router.post('/scan-qr', scanqr);
router.get('/thirdparty', getThirdParty);
router.post('/redeem-offer', redeemOffer);
router.get('/transactions', thirdptransactions);

module.exports = router;