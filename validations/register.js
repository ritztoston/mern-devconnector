const Validator = require('validator');
const isEmpty = require('./is-empty');

const validateRegisterInput = (data) => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name: '';
  data.email = !isEmpty(data.email) ? data.email: '';
  data.password = !isEmpty(data.password) ? data.password: '';
  data.cpassword = !isEmpty(data.cpassword) ? data.cpassword: '';

  if (!Validator.isLength(data.name, {min: 2, max: 30})) {
    errors.name = 'Name must be between 2 and 30 characters';
  }
  if (!Validator.isLength(data.password, {min: 6, max: 30})) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }
  if (Validator.isEmpty(data.cpassword)) {
    errors.cpassword = 'Confirm Password field is required';
  }
  if (!Validator.equals(data.password, data.cpassword)) {
    errors.cpassword = 'Passwords must match';
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }



  return {
    errors,
    isValid: isEmpty(errors)
  }
};

module.exports = validateRegisterInput;
