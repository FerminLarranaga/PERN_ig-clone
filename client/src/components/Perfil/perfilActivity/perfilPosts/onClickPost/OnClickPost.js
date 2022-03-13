import React, { useEffect, useMemo, useState } from 'react';

import Comment from "./comment/Comment";
import OnClickPost_header from './OnClickPost_header/OnClickPost_header';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { CircularProgress } from '@material-ui/core';

import "./OnClickPost.css";
import { useNavigate, useLocation } from 'react-router-dom';
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

export default function OnClickPost({ open, setOpen, postId, isAdmin, isFollowing, postsUser }) {
  const [post, setPost] = useState(null);
  const [postCommentsAndData, setPostCommentsAndData] = useState([]);

  const [comment, setComment] = useState();
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);
  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();

  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
    navigate(location.pathname);
  };

  const changeCommentHandler = (evt) => {
    setComment(evt.target.value);
    if (evt.target.value) {
      const submitBtn = evt.target.form.lastChild;
      submitBtn.disabled = false;
    } else {
      const submitBtn = evt.target.form.lastChild;
      submitBtn.disabled = true;
    }
    evt.target.style.height = 'auto';
    let newHeight = evt.target.value.split('\n').length * 18;
    evt.target.style.height = newHeight + 'px';
  }

  const handlePostComment = (evt) => {
    evt.preventDefault();
    if (comment) {
      fetch(`/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.token
        },
        body: JSON.stringify({
          comment: comment,
          comment_date: new Date()
        })
      }).then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          return auth.loadMessageAlert(errorData?.message, false);
        }
        getComments();
        setComment('');
        evt.target.reset();
      }).catch(e => {
        auth.loadMessageAlert(e.message, false);
      })
    }
  }

  const getPost = function (postId) {
    setPostLoading(true);
    // console.log('GETTING POST');
    fetch(`/posts/p/${postId}`, {
      method: 'GET',
      headers: { token: localStorage.token }
    }).then(async res => {
      if (!res.ok) {
        const errorData = await res.json();
        console.error(errorData);
        return
      }
      const postData = await res.json();
      // console.log(postData);
      setPost(postData);
    }).finally(() => {
      setPostLoading(false);
    }).catch((e) => {
      console.error(e);
      auth.loadMessageAlert(e.message, false);
    })
  }

  const getComments = function (postId) {
    setCommentsLoading(true);
    // console.log('GETTING COMMENTS')

    fetch(`/comments/${postId}`, {
      method: 'GET',
      headers: { token: localStorage.token }
    }).then(async res => {
      const comments = await res.json();
      // console.log(comments);
      setPostCommentsAndData(comments);
    }).finally(() => {
      setCommentsLoading(false);
    }).catch((e) => {
      console.error(e);
      auth.loadMessageAlert(e.message, false);
    })
  }

  useEffect(() => {
    if (postId) {
      getPost(postId);
      getComments(postId);
    } else {
      setPost(null);
    }
    // eslint-disable-next-line
  }, [postId]);

  return (
    post && (
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
              <div className='backBtn__cellphone'>
                <svg onClick={handleClose} aria-label="Volver" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                  <path d="M21 17.502a.997.997 0 01-.707-.293L12 8.913l-8.293 8.296a1 1 0 11-1.414-1.414l9-9.004a1.03 1.03 0 011.414 0l9 9.004A1 1 0 0121 17.502z">
                  </path>
                </svg>
                <h1>
                  {
                    post.file_format === 'img'? 'Foto' : 'Video'
                  }
                </h1>
              </div>
              <OnClickPost_header
                deviceClassName='tabletPostHeader'
                profilePhoto={post.profile_pic}
                username={post.username}
                isAdmin={isAdmin}
                isFollowing={isFollowing}
                postsUser={postsUser}
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
                    postsUser={postsUser}
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
                                  return <Comment key={dataComment.id} comment={dataComment.comment} username={dataComment.username} profilePhoto={dataComment.profile_pic} />
                                })
                              }
                            </div>
                          )
                        } else {
                          let loadingComments = [];
                          for (let i = 0; i < 10; i++) {
                            loadingComments.push(
                              <div key={i} className='post_comment'>
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
                  <section style={{ width: '100%' }} className='feedPost_bottomAddComment'>
                    <form onSubmit={evt => handlePostComment(evt)} className='feedPost_bottomAddCommentForm'>
                      <textarea
                        type='text'
                        placeholder='Agrega un comentario...'
                        className='feedPost_bottomAddCommentInput'
                        autoComplete='off'
                        autoCorrect='off'
                        autoCapitalize='off'
                        onChange={changeCommentHandler}
                      />
                      <button type='submit' className='feedPost_bottomAddCommentPublish' disabled>Publicar</button>
                    </form>
                    {
                      false && (
                        <div className='feedPost_loadingNewComment'>
                          <CircularProgress style={{ width: '25px', height: '25px' }} />
                        </div>
                      )
                    }
                  </section>
                </div>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    )
  );
}