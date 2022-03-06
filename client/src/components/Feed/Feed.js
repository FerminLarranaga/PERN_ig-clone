import React from 'react';
import { useAuth } from '../../App';
import FeedPosts from './FeedPosts/FeedPosts';
import './Feed.css';
import { Navigate } from 'react-router-dom';

const Feed = ({}) => {
    const auth = useAuth();

    return (
        <div className='feed_container'>
            {
                auth.user.total_followed > 0? (
                    <FeedPosts />
                ) : (
                    <Navigate to={{pathname: '/explore/people'}}/>
                )
            }
        </div>
    )
}

export default Feed;