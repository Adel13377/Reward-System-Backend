const express = require('express');
const router = express.Router();
const { logout, login, refreshToken } = require('../../src/controllers/authenticationController');
const authenticateToken = require('../../src/controllers/authenticationController');

router.post('/login-emp', login);

module.exports = router;