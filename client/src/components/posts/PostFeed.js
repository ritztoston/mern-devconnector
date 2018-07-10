import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PostItem from './PostItem';

class PostFeed extends Component {
  render() {
    const {posts, profiles} = this.props;

    // return posts.map(post => <PostItem key={post._id} post={post}/>)
    return posts.map(post => {
      return profiles.map(profile => {
        if(profile.user._id === post.user)
          return <PostItem key={post._id} post={post} handle={profile.handle}/>;
        return '';
      });
    })
  }
}

PostFeed.propTypes = {
  profiles: PropTypes.array.isRequired,
  posts: PropTypes.array.isRequired
};

export default PostFeed;
