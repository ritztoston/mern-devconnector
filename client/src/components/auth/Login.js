import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {loginUser} from "../../actions/authActions";
import TextFieldGroup from '../common/TextFieldGroup';
import SubmitButton from "../common/SubmitButton";

class Login extends Component {
  constructor () {
    super();
    this.state = {
      email: '',
      password: '',
      disabled: false,
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount () {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/feed');
    }

    if(nextProps.auth.loading) {
      this.setState({disabled: !this.state.disabled});
    } else {
      this.setState({disabled: this.state.disabled});
    }

    if(nextProps.errors) {
      this.setState({errors: nextProps.errors})
    }
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  };
  onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.loginUser(userData, this.props.errors);
  };

  render () {

    const {errors, disabled} = this.state;
    const {loading} = this.props.auth;

    return (
       <div className="login">
         <div className="container">
           <div className="row">
             <div className="col-md-8 m-auto">
               <h1 className="display-4 text-center">Log In</h1>
               <p className="lead text-center">Sign in to your SalesRobot account</p>
               <form onSubmit={this.onSubmit}>
                 <TextFieldGroup
                    placeholder="Email Address"
                    name="email"
                    type="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                 />
                 <TextFieldGroup
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    error={errors.password}
                    autocomplete="off"
                 />
                 <SubmitButton disabled={disabled} type="submit" loading={loading}/>
               </form>
             </div>
           </div>
         </div>
       </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {loginUser})(Login);