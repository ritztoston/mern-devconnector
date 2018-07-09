import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import PostForm from './PostForm';
import Spinner from '../common/Spinner';
import {getPosts} from "../../actions/postActions";
import {getProfiles} from '../../actions/profileActions';
import PostFeed from './PostFeed';

class Posts extends Component {
  componentDidMount() {
    this.props.getPosts();
    this.props.getProfiles();
  }

  render () {

    const {posts, loading} = this.props.post;
    const {profiles} = this.props.profile;

    let postContent;

    if(posts === null || loading || profiles === null) {
      postContent = <Spinner/>
    } else {
      postContent = <PostFeed posts={posts} profiles={profiles}/>
    }

    return (
       <div className="feed">
         <div className="container">
           <div className="row">
             <div className="col-md-12">
               <PostForm/>
               {postContent}
             </div>
           </div>
         </div>
       </div>
    )
  }
}

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  getProfiles: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  profile: state.profile
});

export default connect(mapStateToProps, {getPosts, getProfiles})(Posts);