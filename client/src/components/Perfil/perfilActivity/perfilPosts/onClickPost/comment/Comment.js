import React from 'react';

import { Avatar } from '@material-ui/core';

import './Comment.css';

function Comment({ comment, username, profilePhoto }) {
    return (
        <div className='post_comment'>
            <div className='avatar_div'>
                <Avatar src={profilePhoto}/>
            </div>
            <div className='perfil_post_caption'>
                <span style={{whiteSpace: "pre-wrap", overflowWrap: "anywhere"}}>
                    <span className='fw6 mr1'>{username}</span>
                    <span>{comment}</span>
                </span>
            </div>
        </div>
    );
}

export default Comment;