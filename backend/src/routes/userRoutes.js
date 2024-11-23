const express = require('express');
const router = express.Router();
const signup = require('../controllers/signupController');
const { logout, login, refreshToken } = require('../controllers/authenticationController');
const getadmin = require('../controllers/test');
const authenticateToken = require('../controllers/authenticationController');

router.get('/profile', authenticateToken.authenticateToken, getadmin);
router.post('/login', login);
router.post('/signup', signup);
router.post('/refresh-token', refreshToken);
router.delete('/logout', logout);

module.exports = router;