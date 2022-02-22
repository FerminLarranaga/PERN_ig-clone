import React, { Fragment, useState } from 'react';
import { useAuth } from '../../../../../../App';
import { useSelectedUser } from '../../../../../../authentication/RequireAuthProfile';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Avatar from '@material-ui/core/Avatar';
import StopFollowing from '../../../../../Dialogs/StopFollowing/StopFollowing';

import './OnClickPost_header.css';
import { CircularProgress } from '@material-ui/core';

const OnClickPost_header = ({ deviceClassName, username, profilePhoto, isAdmin, isFollowing }) => {
    const [openStopFollowing, setOpenStopFollowing] = useState(false);
    const [loadingFollow, setLoadingFollow] = useState(false);
    const adminUser = useAuth();
    const selectedUser = useSelectedUser();

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

            adminUser.setUser({ ...adminUser.user, total_followed: adminUser.user.total_followed + 1 });
            selectedUser.setUser({
                ...selectedUser.user,
                total_followers: selectedUser.user.total_followers + 1,
                isFollowing: true
            });
        }).catch(e => console.error(e.message)).finally(() => {
            setLoadingFollow(false);
        });
    }

    return (
        <header className={`post_information_div ${deviceClassName}`}>
            <div>
                <Avatar src={profilePhoto} />
            </div>
            <div className='postHeader_details_div'>
                <div className='fw6 username_div'>
                    <p className='usernamePostHeader'>{username}</p>
                </div>

                {
                    function () {
                        if (isAdmin) return
                        
                        if (loadingFollow) {
                            return (
                                <Fragment>
                                    <div className='dot_div'>
                                        <FiberManualRecordIcon style={{ width: 6, height: 6 }} />
                                    </div>
                                    <div className='ml3'>
                                        <CircularProgress style={{width: '20px', height: '20px'}}/>
                                    </div>
                                </Fragment>
                            )
                        }
                        
                        if (isFollowing) {
                            return (
                                <Fragment>
                                    <div className='dot_div'>
                                        <FiberManualRecordIcon style={{ width: 6, height: 6 }} />
                                    </div>
                                    <div onClick={() => setOpenStopFollowing(true)} className='fw6 pa2 pl0 pointer'>
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
                    />
                )
            }
        </header>
    );
}

export default OnClickPost_header;