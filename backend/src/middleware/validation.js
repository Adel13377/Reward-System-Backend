const Users = require('../models/Users');
const employee = require('../models/Employee');
async function validateSignup (values, currentEmployeeId = null) {

    let errors = {};
    
    const minLength = 3;
    const maxLength = 20;
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    const nameRegex = /^[a-zA-Z]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
    const numberRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Allow letters, numbers, and underscores
// username validation
    const existingUser = await Users.findOne({ username: values.username });
    const existingEmployee = await employee.findOne({ username: values.username,
        _id: { $ne: currentEmployeeId }
     });
    if (existingEmployee || existingUser) {
        errors.username = 'User already exists';
    }
        
    if (!values.username) {
        errors.username = 'username is required';
    }
    else if (values.username.length < minLength || values.username.length > maxLength) {
        errors.username = "Username must be between 3 and 20 characters long.";
    }
    else if (!usernameRegex.test(values.username)) {
        errors.username = "Username can only contain letters, numbers, and underscores.";
    }
// password validation

    if (!values.password) {
        errors.password = 'Password is required';
    } else if (values.password.length < 8) {
        errors.password = 'Password must be 8 or more characters';
    } else if (!passwordRegex.test(values.password)) {
        errors.password = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.";
    }
// firstName validation

    if (!values.firstname) {
        errors.firstName = 'First name is required';
    }
    else if (values.firstname.length < minLength || values.firstname.length > maxLength) {
        errors.firstName = "First name must be between 3 and 20 characters long.";
    } else if (!nameRegex.test(values.firstname)) {
        errors.firstName = "First name can only contain letters.";
    }
    
// lastName validation

    if (!values.lastname) {
        errors.lastName = 'Last name is required';
    } else if (values.lastname.length < minLength || values.lastname.length > maxLength) {
        errors.lastName = "Last name must be between 3 and 20 characters long.";
    } else if (!nameRegex.test(values.lastname)) {
        errors.lastName = "Last name can only contain letters.";
    }
// number validation

    if (!values.phonenumber) {
        errors.phonenumber = 'Number is required';
    } else if (values.phonenumber.length !== 11) {
        errors.phonenumber = 'Number must be 11 characters';
    } else if (!numberRegex.test(values.phonenumber)) {
        errors.phonenumber = "Number can only contain numbers.";
    }

// email validation
    if (values.userId) {
        if (!values.email) {
            errors.email = 'email is required';
        }
        else if (!emailRegex.test(values.email)) {
            errors.email = "Invalid email address.";
        }
    }
// company validation

    if (!values.company) {
        errors.company = 'Company is required';
    } else if (values.company.length < 3) {
        errors.company = 'Company must be 3 or more characters'
    } else if (!usernameRegex.test(values.company)) {
        errors.company = "Company can only contain letters, numbers, and underscores.";
    };
    
    
    return errors;
};
module.exports = validateSignup;