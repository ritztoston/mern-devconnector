import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PostItem from './PostItem';
import isEmpty from "../../validations/is-empty";

class PostFeed extends Component {
  render() {
    const {posts, profiles} = this.props;

    return posts.map(post => {
      const profile = profiles.filter(profile => profile.user._id === post.user).map(profile => profile.handle);
      // const handle = profile.map(profile => profile.handle);
      console.log(profile);
      return (
         <PostItem key={post._id} post={post} handle={profile}/>
      )})
  }
}

PostFeed.propTypes = {
  posts: PropTypes.array.isRequired,
  profiles: PropTypes.array.isRequired,
};

export default PostFeed;
