import React, { useEffect, useState } from 'react';

import Comment from "./comment/Comment";
import OnClickPost_header from './OnClickPost_header/OnClickPost_header';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button, TextareaAutosize } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';

import "./OnClickPost.css";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../../App';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper
  },
}));

export default function OnClickPost({ open, setOpen, postId, isAdmin, isFollowing }) {
  const [post, setPost] = useState(null);
  const [postCommentsAndData, setPostCommentsAndData] = useState([]);

  const [comment, setComment] = useState();
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);
  const navigate = useNavigate();
  const auth = useAuth();
  const { username } = useParams();

  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };

  const handlePostComment = () => {
    if (comment) {
      fetch(`/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.token
        },
        body: JSON.stringify({ comment: comment })
      }).then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          return auth.loadMessageAlert(errorData?.message, false);
        }
        getComments();
        setComment('');
      }).catch(e => {
        auth.loadMessageAlert(e.message, false);
      })
    }
  }

  const getPost = function () {
    setPostLoading(true);
    console.log('GETTING POST');
    fetch(`/posts/${username}/${postId}`, {
      method: 'GET',
      headers: { token: localStorage.token }
    }).then(async res => {
      if (!res.ok){
        const errorData = await res.json();
        console.error(errorData);
        return
      }
      const postData = await res.json();
      console.log(postData);
      setPost(postData);
    }).finally(() => {
      setPostLoading(false);
    }).catch((e) => {
      console.error(e);
    })
  }

  const getComments = function () {
    setCommentsLoading(true);
    console.log('GETTING COMMENTS')

    fetch(`/comments/${postId}`, {
      method: 'GET',
      headers: { token: localStorage.token }
    }).then(async res => {
      const comments = await res.json();
      console.log(comments);
      setPostCommentsAndData(comments);
    }).finally(() => {
      setCommentsLoading(false);
    }).catch((e) => {
      console.error(e);
    })
  }

  useEffect(() => {
    if (postId) {
      getPost();
      getComments();
    } else {
      setPost(null);
    }
    // eslint-disable-next-line
  }, [postId]);

  return (
    post ? (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper + ' openedPost_container'}>
              <OnClickPost_header
                deviceClassName='tabletPostHeader'
                profilePhoto={auth.user.profile_pic}
                username={auth.user.username}
                isAdmin={isAdmin}
                isFollowing={isFollowing}
              />
              <div className='postImg_and_comments_container'>
                <div className='img_div'>
                  {
                    post.file_format === 'img' ? (
                      <img key={post.image_url} alt='' src={post.image_url} className='img_post' />
                    ) : (
                      <video key={post.image_url} controls src={post.image_url} preload='auto' className='img_post' onCanPlayThrough={(evt) => console.log('CANPLAYTHROUGH >>> ', evt)} />
                    )
                  }
                </div>
                <div className='post_users_section'>
                  <OnClickPost_header
                    deviceClassName='computerPostHeader'
                    profilePhoto={post.profile_pic}
                    username={post.username}
                    isAdmin={isAdmin}
                    isFollowing={isFollowing}
                  />
                  <div className='comment_section' style={{ overflow: commentsLoading ? 'hidden' : '' }}>
                  {
                    post.caption && (
                      <div className='first_comment'>
                        <Comment comment={post.caption} username={post.username} profilePhoto={post.profile_pic} />
                      </div>
                    )
                  }
                    {
                      function () {
                          if (!commentsLoading) {
                          return (
                            <div>
                              {
                                postCommentsAndData.map(dataComment => {
                                  return <Comment comment={dataComment.comment} username={dataComment.username} profilePhoto={dataComment.profile_pic} />
                                })
                              }
                            </div>
                          )
                        } else {
                          let loadingComments = [];
                          for (let i = 0; i < 10; i++) {
                            loadingComments.push(
                              <div className='post_comment'>
                                <span className='loading_comment_avatar'></span>
                                <div className='loading_comment_caption'>
                                  <div style={{ display: 'flex', width: '100%' }}>
                                    <span className='loading_comment_username'></span>
                                    <span className='loading_comment_txt1'></span>
                                  </div>
                                  <span style={{ marginLeft: '0px', marginTop: '5px' }} className='loading_comment_txt1'></span>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div>
                              {
                                loadingComments.map(loadingComment => loadingComment)
                              }
                            </div>
                          )
                        }
                      }()
                    }
                  </div>
                  <div className={`add_comment_div addComment_computer`}>
                    <TextareaAutosize
                      className='add_comment_textarea'
                      placeholder='Agregar comentario'
                      onChange={(evt) => setComment(evt.target.value)}
                      value={comment}
                    />
                    <Button className='publish_comment' onClick={handlePostComment}><AddBoxIcon fontSize='large' /></Button>
                  </div>
                </div>
              </div>
              <div className={`add_comment_div addComment_tablet`}>
                <TextareaAutosize
                  className='add_comment_textarea'
                  placeholder='Agregar comentario'
                  onChange={(evt) => setComment(evt.target.value)}
                  value={comment}
                />
                <Button className='publish_comment' onClick={handlePostComment}><AddBoxIcon fontSize='large' /></Button>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    ) : (
      ''
    )
  );
}