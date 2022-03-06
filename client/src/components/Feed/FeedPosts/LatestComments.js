import React, { useEffect, useState } from 'react';

const LatestComments = ({ postId, limit }) => {
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);

    const getLatestsComments = () => {
        setCommentsLoading(true);
        fetch(`/comments/${postId}?limit=${limit}`, {
            method: 'GET',
            headers: { token: localStorage.token}
        }).then(async res => {
            if (!res.ok){
                console.log(res);
            }

            const comments = await res.json();
            console.log(comments);
            setComments(comments || []);
        }).catch(e => {
            console.error(e);
        }).finally(() => setCommentsLoading(false))
    }

    useEffect(() => {
        getLatestsComments();
    }, []);

    if (commentsLoading){
        return 'LOADING...'
    } else {
        return (
            <React.Fragment>
            {
                comments.map(comment => (
                    <div key={comment.id} className='feedPost_bottomCaption'>
                        <span className='feedPost_bottomCaptionUsername'>{comment.username}</span>
                        <span className='feedPost_bottomCaptionUsername'>{' '}</span>
                        <span className='feedPost_bottomCaptionContent'>{comment.comment}</span>
                    </div>
                ))
            }
            </React.Fragment>
        )
    }
}

export default LatestComments;