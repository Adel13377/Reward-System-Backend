const thirdparty = require('../models/ThirdPartUsers');
async function evalidate (values, currentthirdId = null) {

    let errors = {};
    
    const minLength = 3;
    const maxLength = 20;
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_ ]*$/;
    const nameRegex = /^[a-zA-Z]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
    const numberRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Allow letters, numbers, and underscores
// name validation
const existinguser = await thirdparty.findOne({ username: values.username,
        _id: { $ne: currentthirdId }
     });
if (existinguser) {
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

if (!values.phonenumber) {
    errors.phonenumber = 'Number is required';
} else if (values.phonenumber.length !== 11) {
    errors.phonenumber = 'Number must be 11 characters';
} else if (!numberRegex.test(values.phonenumber)) {
    errors.phonenumber = "Number can only contain numbers.";
}
if (!values.email) {
    errors.email = 'email is required';
}
else if (!emailRegex.test(values.email)) {
    errors.email = "Invalid email address.";
}
if (!values.industrytype) {
    errors.indusrtytype = 'Industry type is required';
} else if (values.industrytype.length < minLength) {
    errors.indusrtytype = 'Industry type must be 3 or more characters';
}
//  else if (usernameRegex.test(values.industrytype)) {
//     errors.indusrtytype = "Industry type can only contain letters, numbers, and underscores.";
// }
        return errors;
};

module.exports = evalidate;