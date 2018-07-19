import React, { Component } from 'react';
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux';
import Proptypes from 'prop-types';
import isEmpty from '../../validations/is-empty';

// FIELDS
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';

// ACTION
import {createProfile, getCurrentProfile, clearErrors} from '../../actions/profileActions';

class CreateProfile extends Component {
  constructor (props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      handle: '',
      name: '',
      company: '',
      website: '',
      location: '',
      status: '',
      skills: '',
      bio: '',
      twitter: '',
      facebook: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentProfile();
    this.props.clearErrors();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({errors: nextProps.errors})
    }

    if(nextProps.profile.profile){
      const profile = nextProps.profile.profile;

      // Bring skills array back to to CSV
      const skillsCSV = profile.skills.join(',');

      // If profile field doesn't exist, make empty string
      profile.company = !isEmpty(profile.company) ? profile.company : '';
      profile.website = !isEmpty(profile.website) ? profile.website : '';
      profile.location = !isEmpty(profile.location) ? profile.location : '';
      profile.bio = !isEmpty(profile.bio) ? profile.bio : '';
      profile.social = !isEmpty(profile.social) ? profile.social : {};
      profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter: '';
      profile.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook: '';

      // Set component fields state
      this.setState({
        handle: profile.user.handle,
        name: profile.user.name,
        company: profile.company,
        website: profile.website,
        location: profile.location,
        status: profile.status,
        skills: skillsCSV,
        bio: profile.bio,
        twitter: profile.twitter,
        facebook: profile.facebook
      })
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const profileData = {
      handle: this.state.handle,
      name: this.state.name,
      avatar: "//www.gravatar.com/avatar/adf10992770bc6c6484b9a5efa5106bc?s=200&r=pg&d=mm",
      company: this.state.company,
      website: this.state.website,
      location: this.state.location,
      status: this.state.status,
      skills: this.state.skills,
      bio: this.state.bio,
      twitter: this.state.twitter,
      facebook: this.state.facebook
    };

    this.props.createProfile(profileData, this.props.history);
  }
  onChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  render () {
    const {errors, displaySocialInputs} = this.state;
    let socialInputs;

    if (displaySocialInputs) {
      socialInputs = (
         <div>
           <InputGroup
              placeholder="Twitter Profile URL"
              name="twitter"
              icon="fab fa-twitter"
              value={this.state.twitter}
              onChange={this.onChange}
              error={errors.twitter}
           />
           <InputGroup
              placeholder="Facebook Profile URL"
              name="facebook"
              icon="fab fa-facebook"
              value={this.state.facebook}
              onChange={this.onChange}
              error={errors.facebook}
           />
         </div>
      )
    }

    // Select options for status
    const options = [
      {label: '* Select Professional Status', value: ''},
      {label: 'Developer', value: 'Developer'},
      {label: 'Junior Developer', value: 'Junior Developer'},
      {label: 'Intern', value: 'Intern'},
      {label: 'Other', value: 'Other'}
    ];
    return (
       <div className="create-profile">
         <div className="container">
           <div className="row">
             <div className="col-md-8 m-auto">
               <Link to="/dashboard" className="btn btn-light">Go back</Link>
               <h1 className="display-4 text-center">Edit profile</h1>
               <small className="d-block pb-3">* = required fields</small>
               <form onSubmit={this.onSubmit}>
                 <TextFieldGroup
                    placeholder="* Profile Handle"
                    name="handle"
                    value={this.state.handle}
                    onChange={this.onChange}
                    error={errors.handle}
                    info="A unique handle for your profile URL. Your full name, company name,
                     nickname"
                 />
                 <TextFieldGroup
                    placeholder="* Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    error={errors.name}
                    info="How do your friends call you?"
                 />
                 <SelectListGroup
                    placeholder="Status"
                    name="status"
                    value={this.state.status}
                    onChange={this.onChange}
                    options={options}
                    error={errors.status}
                    info="Give us an idea of where you are at in your career"
                 />
                 <TextFieldGroup
                    placeholder="Company"
                    name="company"
                    value={this.state.company}
                    onChange={this.onChange}
                    error={errors.company}
                    info="Could be your own company or one you work for"
                 />
                 <TextFieldGroup
                    placeholder="Website"
                    name="website"
                    value={this.state.website}
                    onChange={this.onChange}
                    error={errors.website}
                    info="Could be your own website or a company one"
                 />
                 <TextFieldGroup
                    placeholder="Location"
                    name="location"
                    value={this.state.location}
                    onChange={this.onChange}
                    error={errors.location}
                    info="City or city & state suggested (eg. Tagbilaran, Cebu)"
                 />
                 <TextFieldGroup
                    placeholder="* Skills"
                    name="skills"
                    value={this.state.skills}
                    onChange={this.onChange}
                    error={errors.skills}
                    info="Please use comma separated values (eg. HTML, CSS, Javascript, PHP)"
                 />
                 <TextAreaFieldGroup
                    placeholder="Short Bio"
                    name="bio"
                    value={this.state.bio}
                    onChange={this.onChange}
                    error={errors.bio}
                    info="Tell us a little about yourself"
                 />

                 <div className="mb-3">
                   <button
                      type="button"
                      onClick={() => {
                        this.setState(prevState => ({
                          displaySocialInputs: !prevState.displaySocialInputs
                        }))
                      }} className="btn btn-light">
                     Add Social Network Links
                   </button>
                   <span className="text-muted"> Optional</span>
                 </div>
                 {socialInputs}
                 <input type="submit" value="Submit" className="btn btn-info btn-block mt-4"/>
               </form>
             </div>
           </div>
         </div>
       </div>
    )
  }
}

CreateProfile.propTypes = {
  createProfile: Proptypes.func.isRequired,
  getCurrentProfile: Proptypes.func.isRequired,
  clearErrors: Proptypes.func.isRequired,
  profile: Proptypes.object.isRequired,
  errors: Proptypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(mapStateToProps, {createProfile, getCurrentProfile, clearErrors})(withRouter(CreateProfile));