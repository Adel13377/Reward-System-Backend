const express = require('express');
const router = express.Router();
const scanqr = require('../controller/scanqrController');
const { getThirdParty } = require('../../src/controllers/superAdminController');
const { redeemOffer } = require('../controller/redeemOffer');

router.post('/scan-qr', scanqr);
router.get('/thirdparty', getThirdParty);
router.post('/redeem-offer', redeemOffer);

module.exports = router;