import React, { Component } from 'react';
import {connect} from 'react-redux';
import Proptypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';

class CreateProfile extends Component {
  constructor (props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      handle: '',
      company: '',
      website: '',
      location: '',
      status: '',
      skills: '',
      bio: '',
      twitter: '',
      facebook: '',
      errors: {}
    }
  }

  render () {
    return (
       <div className="create-profile">
         <div className="container">
           <div className="row">
             <div className="col-md-8 m-auto">
               <h1 className="display-4 text-center">Create your profile</h1>
               <p className="lead text-center">Let's some information to make your profile stand out</p>
               <small className="d-block pb-3">* = required fields</small>
             </div>
           </div>
         </div>
       </div>
    )
  }
}

CreateProfile.propTypes = {
  profile: Proptypes.object.isRequired,
  errors: Proptypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(mapStateToProps)(CreateProfile);