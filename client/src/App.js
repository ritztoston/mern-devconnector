import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';

// ->
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
// -> For logout
import {logoutUser, setCurrentUser} from "./actions/authActions";


import './App.css';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';

import Register from './components/auth/Register';
import Login from './components/auth/Login';

// -> Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and is authenticated
  store.dispatch(setCurrentUser(decoded));

  //Check for expired token
  const currentime = Date.now() /1000;
  if (decoded.exp < currentime) {
    // Logout user
    store.dispatch(logoutUser());
    // TODO: Clear current profile
    // Redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
       <Provider store={store}>
         <Router>
           <div className="App">
             <Navbar/>
             <Route exact path="/" component={Landing}/>
             <div className="container">
               <Route exact path="/register" component={Register}/>
               <Route exact path="/login" component={Login}/>
             </div>
             <Footer/>
           </div>
         </Router>
       </Provider>
    );
  }
}

export default App;