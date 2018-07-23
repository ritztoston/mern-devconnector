import {CLEAR_ERRORS, GET_ERRORS, LOGIN_LOADING, LOGIN_UNLOADING, SET_CURRENT_USER} from "./types";
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// import utility
import setAuthToken from '../utils/setAuthToken';
import isEmpty from "../validations/is-empty";

// Register
export const registerUser = (userData, history) => dispatch => {
  // return {
  //   type: TEST_DISPATCH,
  //   payload: userData
  // }
  axios.post('/api/users/register', userData)
     .then(() => history.push('/login'))
     .catch(err => dispatch({
       type: GET_ERRORS,
       payload: err.response.data
     }));
};

// Login Get user token
export const loginUser = (userData, errors) => dispatch => {
  dispatch(setLoginLoading());

  // console.log(errors);

  if(Object.keys(errors).length > 0) {
    dispatch(clearErrors());
  }
  axios.post('/api/users/login' ,userData)
     .then(res => {
       // Save to localStorage
       const {token} = res.data;
       // Set token to localStorage
       localStorage.setItem('jwtToken', token);
       // Set token to Auth header
       setAuthToken(token);
       // Decode token to get user data
       const decoded = jwt_decode(token);
       // Set current user
       dispatch(setCurrentUser(decoded))
     })
     .catch(err => dispatch(setLoginError(err)));
};

// Clear Errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  }
};

// Login loading
export const setLoginLoading = () => {
  return {
    type: LOGIN_LOADING
  }
};
// Set Login Error
export const setLoginError = (err) => dispatch => {
  dispatch(getErrors(err));
  dispatch(stopLoginLoading());
};
// Get errors
export const getErrors = (err) => {
  return {
    type: GET_ERRORS,
    payload: err.response.data
  }
};
// stop login loading due to error
export const stopLoginLoading = () => {
  return {
    type: LOGIN_UNLOADING
  }
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
};

// Log user out
export const logoutUser = (history) => dispatch => {
  if(isEmpty(history)) {
    // Remove token from ls
    localStorage.removeItem('jwtToken');
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to {}
    dispatch(setCurrentUser({}));
  } else {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    history.push('/login');
  }
};
