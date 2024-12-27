const  evalidate = (values) => {

    let errors = {};
    
    const minLength = 3;
    const maxLength = 20;
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    const nameRegex = /^[a-zA-Z]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numberRegex = /^[0-9]+$/;
    // Allow letters, numbers, and underscores
// name validation

    if (!values.username) {
        errors.username = 'name is required';
    }
    else if (values.username.length < minLength || values.username.length > maxLength) {
        errors.username = "name must be between 3 and 20 characters long.";
    }
    else if (!nameRegex.test(values.username)) {
        errors.username = "name name can only contain letters.";
    }

// email validation
    
        if (!values.email) {
            errors.email = 'email is required';
        }
        else if (!emailRegex.test(values.email)) {
            errors.email = "Invalid email address.";
        }
// phone number validation
    
        if (!values.phonenumber) {
            errors.phonenumber = 'phone number is required';
        } else if (values.phonenumber.length === 11) {
            errors.phonenumber = 'phone number must be 11 characters';
        } else if (!numberRegex.test(values.phonenumber)) {
            errors.phonenumber = "phone number can only contain numbers.";
        }

        return errors;
}

module.exports = evalidate;