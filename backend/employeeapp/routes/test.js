const express = require('express');
const router = express.Router();
const getofferstransactions = require('../controller/test');

router.get('/gettt', getofferstransactions);

module.exports = router;