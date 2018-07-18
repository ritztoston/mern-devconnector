import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classnames from 'classnames';
import {Link} from 'react-router-dom';
import {deletePost, addLike, removeLike} from "../../actions/postActions";
import {getUser} from "../../actions/profileActions";
import axios from "axios/index";
class PostItem extends Component {
  constructor (props){
    super(props);
    this.state = {
      handle: ''
    }
  }

  componentWillMount() {
    axios.get(`/api/users/${this.props.post.user}`)
       .then(user => this.setState({handle: user.data.handle}))
       .catch(() => this.setState({handle: 'noHandle'}));
    console.log(this.state.handle);
  }

  onDeleteClick(id) {
    this.props.deletePost(id);
  }

  onLikeClick(id) {
    this.props.addLike(id);
  }

  onUnlikeClick(id) {
    this.props.removeLike(id);
  }

  findUserLike(likes) {
    const {auth} = this.props;
    return likes.filter(like => like.user === auth.user.id).length > 0;
  }



  render () {

    const {post, auth, showActions, user} = this.props;
    if(this.state.handle.length === 0) {
      console.log('loading...');
    }

    //const test = getUser(post.user);
    //console.log(test);
    // console.log(getUser(post.user));
    // console.log(post.user.name);
    // this.props.getUser(post.user);
    //console.log(post.user);
    //this.updateHandle(post.user);

    return (
       <div className="card card-body mb-2">
         <div className="row">
           <div className="col-md-2">
             <Link to={`/profile/profile`}>
               <img className="rounded-circle d-none d-md-block"
                    src={post.avatar}
                    alt=""/>
             </Link>
             <br/>
             <p className="text-center">{post.name}</p>
           </div>
           <div className="col-md-10">
             <p className="lead">{post.text}</p>
             {showActions ? (<span>
               <button onClick={this.findUserLike(post.likes) ? this.onUnlikeClick.bind(this, post._id) : this.onLikeClick.bind(this, post._id)} type="button" className="btn btn-light mr-1">
               <i className={classnames('fa fa-thumbs-up', {
                 'text-info': this.findUserLike(post.likes)
               })}/>
               <span className="badge badge-light">{this.findUserLike(post.likes) ? (<span>Liked</span>) : (<span>Like</span>)} - {post.likes.length}</span>
             </button>
             <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
               Comments
             </Link>
               {post.user === auth.user.id ? (
                  <button onClick={this.onDeleteClick.bind(this, post._id)}
                          type="button"
                          className="btn btn-danger mr-1">
                    <i className="fas fa-times"/>
                  </button>
               ) : null}
             </span>) : null}
           </div>
         </div>
       </div>
    )
  }
}

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.profile.user
});

export default connect(mapStateToProps, {deletePost, addLike, removeLike})(PostItem);