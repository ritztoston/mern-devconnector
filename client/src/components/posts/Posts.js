import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import PostForm from './PostForm';
import Spinner from '../common/Spinner';
import {getPosts} from "../../actions/postActions";
import PostFeed from './PostFeed';
import {withRouter} from 'react-router-dom';

class Posts extends Component {
  componentDidMount() {
    this.props.getPosts();
  }

  render () {

    const {posts, loading} = this.props.post;

    let postContent;
    let postForm;

    if(posts === null || loading) {
      postContent = <Spinner/>
    } else {
      postForm = <PostForm/>;
      postContent = <PostFeed posts={posts}/>;
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
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(mapStateToProps, {getPosts})(withRouter(Posts));