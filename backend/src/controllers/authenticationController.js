const express = require('express');
const RefreshToken = require('../models/RefreshToken');
const Users = require('../models/Users');
const emp = require('../models/Employee');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');
const ThirdParty = require('../models/ThirdPartUsers');
require('dotenv').config();


const DEFAULT_PASSWORD = "P@ssw0rd2024"; // Default password
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync(DEFAULT_PASSWORD, 10);

const refreshToken = async (req, res) => {
    const refreshToken = req.body.token;

    if (refreshToken == null) return res.sendStatus(401);
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) return res.sendStatus(403).json({ error: 'Invalid refresh token' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403).json({ error: 'Invalid token' });

        console.log("Decoded user from refresh token:", user);
        const { username, _id, name, role } = user;
        const accessToken = generateAccessToken({ _id, username, name, role });
        console.log("accessToken: " + accessToken);
        res.json({ accessToken: accessToken })
    })
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m'})
}


const login = async (req, res) => {
    try {
        const { username, password, role } = req.body; // Add `role` parameter to differentiate users.
        console.log("username: " + username);
        if (!username || !password || !role) {
            return res.status(400).json({ error: 'Username, password, and role are required' });
        }
        
        // Determine the collection based on role
        const UserModel =
        role === 'admin' ? Users :
        role === 'emp' ? emp :
        role === 'superadmin' ? SuperAdmin :
        role === 'thirdparty' ? ThirdParty :
        null;
    
    if (!UserModel) {
        return res.status(400).json({ error: 'Invalid role' }); // Send response and exit
    }
    
    // Check username
    const user = await UserModel.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Invalid username or password' });
        
        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid username or password' });
        const isDefaultPassword = await bcrypt.compare(password, DEFAULT_PASSWORD_HASH);
        // Create and assign a token
        const userPayload = { _id: user._id, username: user.username, name: user.firstname, role };
        console.log("user: " + user);
        console.log("userPayload: ", userPayload);
        const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        
        // Save refresh token
        await RefreshToken.deleteMany({ userId: user._id}); // Clear existing tokens for simplicity (optional)
        await new RefreshToken({ token: refreshToken, userId: user._id }).save();
        
        
        res.json({ accessToken: accessToken, refreshToken: refreshToken, passwordChangeRequired: isDefaultPassword});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

const logout = async (req, res) => {
    try {
        const token = req.body.token;
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }
        console.log("Token: ", token);
        // Remove the refresh token from the database
        const result = await RefreshToken.deleteOne({ token });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Token not found' });
        }

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { login, refreshToken, logout, authenticateToken };