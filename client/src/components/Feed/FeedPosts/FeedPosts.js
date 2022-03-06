import { Avatar, CircularProgress } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../App';
import OnClickPost from '../../Perfil/perfilActivity/perfilPosts/onClickPost/OnClickPost';
import './FeedPosts.css';
import LatestComments from './LatestComments';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const FeedPosts = () => {
    const [newComment, setNewComment] = useState('');
    const [loadingNewComment, setLoadingNewComment] = useState('');
    const [posts, setPosts] = useState([]);
    const postsAreLoading = useRef(false);
    const [openedPostId, setOpenedPostId] = useState(false);
    const requestedPosts = useRef(0);
    const bottomDiv = useRef();
    const memoiazedPosts = useRef([]);
    const rightContainerRef = useRef();
    const bottomDivObserver = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { getFollowingPosts() } }, { threshold: 1, rootMargin: '600px' })

    const navigate = useNavigate();
    const auth = useAuth();
    const query = useQuery();

    const changeCommentHandler = (evt) => {
        setNewComment(evt.target.value);
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

    const formatedDate = (date) => {
        var strArray = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        var d = date.getDate();
        var m = strArray[date.getMonth()];
        var y = date.getFullYear();
        return '' + (d <= 9 ? '0' + d : d) + ' de ' + m + ' de ' + y;
    }

    const submitNewComment = (evt, postId) => {
        evt.preventDefault();
        if (newComment) {
            setLoadingNewComment(true);
            evt.target.lastChild.disabled = true;
            fetch(`/comments/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.token
                },
                body: JSON.stringify({
                    comment: newComment,
                    comment_date: new Date()
                })
            }).then(async res => {
                if (!res.ok) {
                    const errorData = await res.json();
                    return auth.loadMessageAlert(errorData?.message, false);
                }
                setNewComment('');
                evt.target.reset();
                const newCommentElement = document.createElement('div');
                newCommentElement.classList.add('feedPost_bottomCaption');
                newCommentElement.innerHTML = `<span class='feedPost_bottomCaptionUsername'></span><span class='feedPost_bottomCaptionUsername'> </span><span class='feedPost_bottomCaptionContent'></span>`
                newCommentElement.children[0].innerText = auth.user.username;
                newCommentElement.children[2].innerText = newComment;
                evt.target.parentNode.parentNode.querySelector('.feedPost_bottomComments').appendChild(newCommentElement);
            }).catch(e => {
                auth.loadMessageAlert(e.message, false);
            }).finally(() => setLoadingNewComment(false))
        }
    }

    const getFollowingPosts = () => {
        if (postsAreLoading.current) return

        postsAreLoading.current = true;
        fetch(`/posts/getFollowingPosts?limit=${3}&offset=${requestedPosts.current}`, {
            method: 'GET',
            headers: { token: localStorage.token }
        }).then(async res => {
            if (!res.ok) {
                const errorData = await res.json();
                return console.error(errorData);
            }

            const newPosts = await res.json();
            memoiazedPosts.current.push(...newPosts);
            setPosts([...memoiazedPosts.current]);
            requestedPosts.current = requestedPosts.current + 3;
            postsAreLoading.current = false
        }).catch(err => {
            console.error(err);
            postsAreLoading.current = false
        })
    }

    const openPostFunc = (postId) => {
        navigate('?postId=' + postId);
        setOpenedPostId(postId);
    }

    const repositionRightContainer = (elmnt) => {
        const parentOffsetLeft = elmnt.parentNode.offsetLeft;
        const parentWidth = elmnt.parentNode.clientWidth;
        const rightContainerWidth = elmnt.clientWidth;
        elmnt.style = 'left: ' + (parentOffsetLeft + parentWidth - rightContainerWidth) + 'px';
    }

    useEffect(() => {
        getFollowingPosts();
        bottomDivObserver.observe(bottomDiv.current);
        repositionRightContainer(rightContainerRef.current);
        window.addEventListener('resize', () => {
            repositionRightContainer(rightContainerRef.current);
        })
    }, []);

    useEffect(() => {
        const paramedPostId = query.get("postId");
        if (paramedPostId) {
            setOpenedPostId(paramedPostId);
        } else {
            setOpenedPostId(false);
        }
    }, [query])

    return (
        <div className='feedPosts_masterContainer'>
            <div className='feedPosts_container'>
                {
                    posts.map(post => (
                        <div className='feedPost_postContainer' key={post.id}>
                            <div className='feedPost_headerContainer'>
                                <div className='feedPost_header'>
                                    <Avatar
                                        style={{ width: 35, height: 35 }}
                                        src={post.profile_pic}
                                        className='feedPost_headerAvatar'
                                    />
                                    <div className='feedPost_headerInfo'>
                                        <span className='feedPost_headerUsername'>{post.username}</span>
                                        {/* <span className='feedPost_headerFullName'>Full Name</span> */}
                                    </div>
                                </div>
                                <div className='feedPost_headerOptions'>
                                    <svg aria-label="Más opciones" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                        <circle cx="12" cy="12" r="1.5"></circle>
                                        <circle cx="6" cy="12" r="1.5"></circle>
                                        <circle cx="18" cy="12" r="1.5"></circle>
                                    </svg>
                                </div>
                            </div>
                            <div className='feedPost_content'>
                                {
                                    post.file_format === 'img' ? (
                                        <img alt='' src={post.image_url} />
                                    ) : (
                                        <video controls autoPlay muted src={post.image_url} />
                                    )
                                }
                            </div>
                            <div className='feedPost_bottom'>
                                <section className='feedPost_bottomBtns'>
                                    <button>
                                        <svg aria-label="Me gusta" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                            <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z">
                                            </path>
                                        </svg>
                                    </button>
                                    <button onClick={(evt) => openPostFunc(post.id)}>
                                        <svg aria-label="Comentar" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                            <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2">
                                            </path>
                                        </svg>
                                    </button>
                                    <button>
                                        <svg aria-label="Compartir publicación" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                            <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083">
                                            </line>
                                            <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2">
                                            </polygon>
                                        </svg>
                                    </button>
                                    <button style={{ marginLeft: 'auto' }}>
                                        <svg aria-label="Guardar" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                            <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                            </polygon>
                                        </svg>
                                    </button>
                                </section>
                                <section className='feedPost_bottomLikes'>
                                    <span>
                                        {'327'}
                                        {' '}
                                        {'Me gusta'}
                                    </span>
                                </section>
                                <div className='feedPost_bottomComments'>
                                    {
                                        post.caption && (
                                            <div className='feedPost_bottomCaption'>
                                                <span className='feedPost_bottomCaptionUsername'>{post.username}</span>
                                                <span className='feedPost_bottomCaptionUsername'>{' '}</span>
                                                <span className='feedPost_bottomCaptionContent'>{post.caption}</span>
                                            </div>
                                        )
                                    }
                                    <div className='feedPost_bottomCommentsContainer' onClick={() => openPostFunc(post.id)}>
                                        <span>{'Ver los '}</span>
                                        <span>{'16'}</span>
                                        <span>{' '}</span>
                                        <span>{'comentarios'}</span>
                                    </div>
                                    <LatestComments postId={post.id} limit={2} />
                                </div>
                                <div className='feedPost_bottomTime'>
                                    <time>{formatedDate(new Date(post.post_date))}</time>
                                </div>
                                <section className='feedPost_bottomAddComment'>
                                    <form onSubmit={(evt) => submitNewComment(evt, post.id)} className='feedPost_bottomAddCommentForm'>
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
                                        loadingNewComment && (
                                            <div className='feedPost_loadingNewComment'>
                                                <CircularProgress style={{ width: '25px', height: '25px' }} />
                                            </div>
                                        )
                                    }
                                </section>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='feedPosts_rightContainer' ref={rightContainerRef}>
                <div className='feedPosts_usersProfileContainer'>
                    <div className='feedPosts_usersProfileInfo'>
                        <Avatar
                            style={{ width: 56, height: 56 }}
                            className='feedPosts_usersProfileAvatar'
                            src={auth.user.profile_pic}
                        />
                        <div className='feedPosts_usersProfileInfoTxt'>
                            <span className='feedPosts_usersProfileUsername'>{auth.user.username}</span>
                            <span className='feedPosts_usersProfileFullName'>{auth.user.full_name}</span>
                        </div>
                    </div>
                    <button className='feedPosts_usersProfileChangeBtn'>Cambiar</button>
                </div>
                <div className='feedPosts_recommended'>
                    <div className='feedPosts_recommendedTitle'>
                        <span>Sugerencias para ti</span>
                        <button onClick={() => navigate('/explore/people')}>Ver todo</button>
                    </div>
                    <div className='feedPosts_usersProfileContainer' style={{padding: '8px 4px', margin: 0}}>
                        <div className='feedPosts_usersProfileInfo'>
                            <Avatar
                                className='feedPosts_usersProfileAvatar'
                                src=''
                                style={{width: 32, height: 32}}
                            />
                            <div className='suggests_userInfoTxt'>
                                <span className='suggests_userUsername'>Username</span>
                                <span className='suggests_userPopular'>Popular</span>
                            </div>
                        </div>
                        <button onClick={() => { }} className="feedPosts_usersProfileChangeBtn">Seguir</button>
                    </div>
                    <div className='feedPosts_usersProfileContainer' style={{padding: '8px 4px', margin: 0}}>
                        <div className='feedPosts_usersProfileInfo'>
                            <Avatar
                                className='feedPosts_usersProfileAvatar'
                                src=''
                                style={{width: 32, height: 32}}
                            />
                            <div className='suggests_userInfoTxt'>
                                <span className='suggests_userUsername'>Username</span>
                                <span className='suggests_userPopular'>Popular</span>
                            </div>
                        </div>
                        <button onClick={() => { }} className="feedPosts_usersProfileChangeBtn">Seguir</button>
                    </div>
                    <div className='feedPosts_usersProfileContainer' style={{padding: '8px 4px', margin: 0}}>
                        <div className='feedPosts_usersProfileInfo'>
                            <Avatar
                                className='feedPosts_usersProfileAvatar'
                                src=''
                                style={{width: 32, height: 32}}
                            />
                            <div className='suggests_userInfoTxt'>
                                <span className='suggests_userUsername'>Username</span>
                                <span className='suggests_userPopular'>Popular</span>
                            </div>
                        </div>
                        <button onClick={() => { }} className="feedPosts_usersProfileChangeBtn">Seguir</button>
                    </div>
                    <div className='feedPosts_usersProfileContainer' style={{padding: '8px 4px', margin: 0}}>
                        <div className='feedPosts_usersProfileInfo'>
                            <Avatar
                                className='feedPosts_usersProfileAvatar'
                                src=''
                                style={{width: 32, height: 32}}
                            />
                            <div className='suggests_userInfoTxt'>
                                <span className='suggests_userUsername'>Username</span>
                                <span className='suggests_userPopular'>Popular</span>
                            </div>
                        </div>
                        <button onClick={() => { }} className="feedPosts_usersProfileChangeBtn">Seguir</button>
                    </div>
                    
                </div>
                <div className='feedPosts_legalSection'>

                </div>
            </div>
            <OnClickPost
                isAdmin={false}
                isFollowing={true}
                open={Boolean(openedPostId)}
                setOpen={setOpenedPostId}
                postId={openedPostId}
            />
            <div ref={bottomDiv} />
        </div>
    )

}

export default FeedPosts;