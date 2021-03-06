import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {logoutUser} from "../../actions/authActions";
import {clearCurrentProfile} from "../../actions/profileActions";

class Navbar extends Component {
  onLogoutLink (e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser(this.props.history);
  }


  render () {
    const {isAuthenticated, user} = this.props.auth;

    const guestLinks = (
       <ul className="navbar-nav ml-auto">
         <li className="nav-item">
           <Link className="nav-link" to="/register">Sign Up</Link>
         </li>
         <li className="nav-item">
           <Link className="nav-link" to="/login">Login</Link>
         </li>
       </ul>
    );

    const authLinks = (
       <ul className="navbar-nav ml-auto">
         <li className="nav-item">
           <Link className="nav-link" to="/dashboard">
             {user.name}
           </Link>
         </li>
         <li className="navitem">
           <div className="dropdown">
             <Link className="nav-link" to="/dashboard">
               <img className="rounded-circle" src={user.avatar} alt={user.name} title="You must have a Gravatar connected to your email to display an image" style={{width: '25px', marginRight: '5px'}}/>
             </Link>
             <div className="dropdown-content">
               <Link className="nav-link" to="/edit-profile" style={{color: "black", fontSize: "16px", textAlign: "right", margin: "0", border: "0"}}>
                 Edit Profile
               </Link>
               <hr className="navbar-divider" style={{margin: "0"}}/>
               <a href="" className="nav-link" onClick={this.onLogoutLink.bind(this)}  style={{color: "black", fontSize: "16px", textAlign: "right"}}>
                 Logout
               </a>
             </div>
           </div>
         </li>
       </ul>
    );

    return (
       <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
         <div className="container">
           <Link className="navbar-brand" to="/">SalesRobot</Link>
           <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
             <span className="navbar-toggler-icon"> </span>
           </button>

           <div className="collapse navbar-collapse" id="mobile-nav">
             <ul className="navbar-nav mr-auto">
               <li className="nav-item">
                 <Link className="nav-link" to="/profiles"> Developers
                 </Link>
               </li>
             </ul>
             {isAuthenticated ? authLinks: guestLinks}
           </div>
         </div>
       </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {logoutUser, clearCurrentProfile})(withRouter(Navbar));