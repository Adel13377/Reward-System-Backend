const Users = require('../models/Users');
const express = require('express');
const validateSignup = require('../middleware/validation');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
    const data = {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        number: req.body.number,
        company: req.body.company
    }
    
    const errors = await validateSignup(data);
    if (Object.keys(errors).length > 0) {
        console.log(`Erroooooors: ${JSON.stringify(errors, null, 2)}`);
        return res.status(400).json({ errors });
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    
    try{
        const userdata = await Users.insertMany(data);
        console.log("userdata::::::::::" +userdata);
        res.status(201).json({ message: "User added successfully", userdata });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
};

module.exports = signup;