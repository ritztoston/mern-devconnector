import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import PostForm from './PostForm';
import Spinner from '../common/Spinner';
import {getPosts} from "../../actions/postActions";
import PostFeed from './PostFeed';
import {getCurrentProfile, getProfiles} from '../../actions/profileActions';
import {withRouter} from 'react-router-dom';

class Posts extends Component {
  componentDidMount() {
    this.props.getPosts();
    this.props.getCurrentProfile();
    this.props.getProfiles();
  }

  render () {

    const {posts, loading} = this.props.post;
    const {profile, profiles} = this.props.profile;

    let postContent;
    let postForm;

    if(posts === null || loading || profile === null || profiles === null) {
      postContent = <Spinner/>
    } else {
      if (Object.keys(profile).length > 0) {
        postForm = <PostForm/>;
        postContent = <PostFeed posts={posts} profiles={profiles}/>;
      }
      else {
        this.props.history.push('/dashboard');
      }
    }




    return (
       <div className="feed">
         <div className="container">
           <div className="row">
             <div className="col-md-12">
               {postForm}
               {postContent}
             </div>
           </div>
         </div>
       </div>
    )
  }
}

Posts.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getProfiles: PropTypes.func.isRequired,
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  profile: state.profile
});

export default connect(mapStateToProps, {getPosts, getCurrentProfile, getProfiles})(withRouter(Posts));