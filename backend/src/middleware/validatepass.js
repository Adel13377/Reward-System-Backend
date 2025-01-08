async function validatepass (values) {
    let errors = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

    if (!values.password) {
        errors.password = 'Password is required';
    } else if (values.password.length < 8) {
        errors.password = 'Password must be 8 or more characters';
    } else if (!passwordRegex.test(values.password)) {
        errors.password = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.";
    }

    return errors;
}

module.exports = validatepass;