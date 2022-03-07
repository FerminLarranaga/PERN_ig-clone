import React from 'react';

import { Avatar } from '@material-ui/core';

import './Comment.css';

function Comment({ comment, username, profilePhoto }) {
    return (
        <div className='post_comment'>
            <div className='avatar_div'>
                <Avatar style={{width: 32, height: 32}} src={profilePhoto}/>
            </div>
            <div className='perfil_post_caption'>
                <span style={{whiteSpace: "pre-wrap", overflowWrap: "anywhere"}}>
                    <span className='fw6 mr1 postComment_username'>{username}</span>
                    <span className='fw6 mr1 postComment_content'>{comment}</span>
                </span>
            </div>
        </div>
    );
}

export default Comment;