import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../App';
import StopFollowing from '../../Dialogs/StopFollowing/StopFollowing';
import './Suggests.css';

const Suggests = () => {
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const [openStopFollowing, setOpenStopFollowing] = useState({
        open: false,
        username: '',
        profile_pic: '',
        success: () => {}
    });
    const adminUser = useAuth()

    const getRecommendedUsers = () => {
        fetch('/recommended', {
            method: 'GET',
            headers: { token: localStorage.token }
        }).then(async res => {
            const users = await res.json();
            console.log(users);
            setRecommendedUsers(users);
        }).catch(err => {
            console.error(err);
        });
    }

    const handleFollowing = (evt, item) => {
        // setLoadingFollow(true);
        const {isFollowing, username, profile_pic} = item;

        if (!isFollowing){
            evt.target.style.background = 'black'
            fetch('/startFollowing', {
                method: 'POST',
                headers: {
                    token: localStorage.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ followedUsername: username })
            }).then(async res => {
                if (!res.ok) {
                    console.error(await res.json());
                    return
                }
                
                adminUser.setUser({ ...adminUser.user, total_followed: adminUser.user.total_followed + 1 });
                
                item.isFollowing = true;
                evt.target.classList.remove('suggests_followBtn')
                evt.target.classList.add('suggests_followingBtn')
                evt.target.innerText = 'Siguiendo'
            }).catch(e => console.error(e.message)).finally(() => {
                // setLoadingFollow(false);
            }).finally(() => {
                evt.target.style.background = 'transparent'
            });
        } else {
            setOpenStopFollowing({
                open: true,
                username: username,
                profile_pic: profile_pic,
                success: () => {
                    item.isFollowing = false;
                    evt.target.classList.remove('suggests_followingBtn')
                    evt.target.classList.add('suggests_followBtn')
                    evt.target.innerText = 'Seguir'
                    adminUser.setUser({ ...adminUser.user, total_followed: adminUser.user.total_followed - 1 });
                },
                onloading: () => {
                    evt.target.style.background = 'black'
                },

                stoploading: () => {
                    evt.target.style.background = '#0095f6'
                }
            })
        }
    }

    useEffect(() => {
        getRecommendedUsers();
    }, [])

    return (
        <div className='suggests_container'>
            <h4 className='suggests_containerTitle'>Sugerencias para ti</h4>
            <div className='suggests_section'>
                {
                    recommendedUsers.map(item => (
                        <div key={item.username} className='suggests_user'>
                            <div className='suggests_userInfo'>
                                <Link to={`/${item.username}`} className='usernamePostHeader'>
                                    <Avatar
                                        className='suggests_userInfoAvatar'
                                        src={item.profile_pic}
                                    />
                                </Link>

                                <div className='suggests_userInfoTxt'>
                                    <Link to={`/${item.username}`} className='usernamePostHeader'>
                                        <span className='suggests_userUsername'>{item.username}</span>
                                    </Link>
                                    <span className='suggests_userFullName'>{item.full_name}</span>
                                    <span className='suggests_userPopular'>Popular</span>
                                </div>
                            </div>
                            <button
                                onClick={(evt) => {handleFollowing(evt, item)}}
                                className={item.isFollowing? "suggests_followingBtn" : "suggests_followBtn"}
                            >{item.isFollowing? 'Siguiendo' : 'Seguir'}
                                <div />
                            </button>
                        </div>
                    ))
                }
            </div>
            {
                openStopFollowing.open && (
                    <StopFollowing
                        closeDialog={() => setOpenStopFollowing({open: false})}
                        startLoading={openStopFollowing.onloading}
                        stopLoading={openStopFollowing.stoploading}
                        postsUser={{user: {...openStopFollowing}}}
                        setIsFollowing={openStopFollowing.success}
                    />
                )
            }
        </div>
    )
}

export default Suggests;