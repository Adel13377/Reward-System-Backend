const express = require('express');
const router = express.Router();
const generateqr = require('../controller/generateqrController');
const confirmation = require('../controller/confirmationController');

router.post('/generate-qr', generateqr);
router.post('/confirmation', confirmation);

module.exports = router;