const express = require('express');
const RefreshToken = require('../models/RefreshToken');
const Users = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const refreshToken = async (req, res) => {
    const refreshToken = req.body.token;

    if (refreshToken == null) return res.sendStatus(401);
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) return res.sendStatus(403).json({ error: 'Invalid refresh token' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403).json({ error: 'Invalid token' });

        const { username, _id } = user;
        const accessToken = generateAccessToken({ _id, username });
        res.json({ accessToken: accessToken })
    })
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m'})
}


const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("username: " + username);
        //check username
        const user = await Users.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Invalid username or password' });
        //check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid username or password' });
        //create and assign a token
        const userPayload = { _id: user._id, username: user.username };
        console.log("user: " + user);
        const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'});
        const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d'});
        //save refresh token
        await new RefreshToken({ token: refreshToken, userId: user._id }).save();

        res.json({ accessToken: accessToken , refreshToken: refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server occurred' });
    }
}

const logout = async (req, res) => {
    try {
        const token = req.body.token;
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }
        
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

module.exports = { login, refreshToken, logout };