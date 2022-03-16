import React, { Fragment, useState } from 'react';
import { useAuth } from '../../../../../../App';
import { useSelectedUser } from '../../../../../../authentication/RequireAuthProfile';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Avatar from '@material-ui/core/Avatar';
import StopFollowing from '../../../../../Dialogs/StopFollowing/StopFollowing';

import './OnClickPost_header.css';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';

const OnClickPost_header = ({ deviceClassName, username, profilePhoto, isAdmin, isFollowing, postsUser }) => {
    const [openStopFollowing, setOpenStopFollowing] = useState(false);
    const [loadingFollow, setLoadingFollow] = useState(false);
    const adminUser = useAuth();
    let selectedUser = useSelectedUser();
    selectedUser = postsUser? {user: {username: username}} : selectedUser;
    const [isBeingFollowed, setIsBeingFollowed] = useState(isFollowing);

    const handleFollowing = () => {
        setLoadingFollow(true);
        fetch('/startFollowing', {
            method: 'POST',
            headers: {
                token: localStorage.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ followedUsername: selectedUser.user.username })
        }).then(async res => {
            if (!res.ok) {
                console.error(await res.json());
                return
            }

            if (postsUser) {
                setIsBeingFollowed(true);
                return
            }
            
            adminUser.setUser({ ...adminUser.user, total_followed: adminUser.user.total_followed + 1 });
            selectedUser.setUser({
                ...selectedUser.user,
                total_followers: selectedUser.user.total_followers + 1,
                isFollowing: true
            });
            setIsBeingFollowed(true);
        }).catch(e => console.error(e.message)).finally(() => {
            setLoadingFollow(false);
        });
    }

    return (
        <header className={`post_information_div ${deviceClassName}`}>
            <div>
                <Avatar style={{width: 32, height: 32}} src={profilePhoto} />
            </div>
            <div className='postHeader_details_div'>
                <div className='fw6 username_div'>
                    <Link to={`/${username}`} className='usernamePostHeader'>{username}</Link>
                </div>

                {
                    function () {
                        if (isAdmin) return
                        
                        if (loadingFollow) {
                            return (
                                <Fragment>
                                    <div className='dot_div'>
                                        <FiberManualRecordIcon style={{ width: 5, height: 5 }} />
                                    </div>
                                    <div className='ml3'>
                                        <CircularProgress style={{width: '20px', height: '20px'}}/>
                                    </div>
                                </Fragment>
                            )
                        }
                        
                        if (isBeingFollowed) {
                            return (
                                <Fragment>
                                    <div className='dot_div'>{'•'}</div>
                                    <div onClick={() => setOpenStopFollowing(true)} className='fw6 pa2 pl0 pointer postHeader_startFollowingBtn'>
                                        <span>Siguiendo</span>
                                    </div>
                                </Fragment>
                            )
                        } else {
                            return (
                                <Fragment>
                                    <div className='dot_div'>
                                        <FiberManualRecordIcon style={{ width: 6, height: 6 }} />
                                    </div>
                                    <div onClick={handleFollowing} className='fw6 pa2 pl0 startFollowingPost'>
                                        <span>Seguir</span>
                                    </div>
                                </Fragment>
                            )
                        }
                    }()
                }
            </div>
            <div className='btn_3_dots'>
                <MoreHorizIcon />
            </div>
            {
                openStopFollowing && (
                    <StopFollowing
                        closeDialog={() => setOpenStopFollowing(false)}
                        startLoading={() => setLoadingFollow(true)}
                        stopLoading={() => setLoadingFollow(false)}
                        postsUser={postsUser && {user: {username: username, profile_pic: profilePhoto}}}
                        setIsFollowing={setIsBeingFollowed}
                    />
                )
            }
        </header>
    );
}

export default OnClickPost_header;