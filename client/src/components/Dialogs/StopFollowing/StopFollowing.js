import { Avatar } from '@material-ui/core';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './StopFollowing.css';
import { useAuth } from '../../../App';
import { useSelectedUser } from '../../../authentication/RequireAuthProfile';

const StopFollowing = ({ closeDialog, startLoading, stopLoading, postsUser, setIsFollowing }) => {
    const adminUser = useAuth();
    let selectedUser = useSelectedUser();
    selectedUser = postsUser? postsUser : selectedUser;

    const handleFollowing = () => {
        startLoading();
        closeDialog();
        fetch('/stopFollowing', {
            method: 'DELETE',
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
                setIsFollowing(false);
                return
            }

            adminUser.setUser({ ...adminUser.user, total_followed: adminUser.user.total_followed - 1 });
            selectedUser.setUser({
                ...selectedUser.user,
                total_followers: selectedUser.user.total_followers - 1,
                isFollowing: false
            });
            setIsFollowing && setIsFollowing(false);
        }).catch(e => {
            adminUser.loadMessageAlert(e.message, false);
            console.error(e.message)
        }).finally(() => {
            stopLoading();
        });
    }

    useEffect(() => {
        document.body.classList.add('scrollbar-grey');

        return () => {
            document.body.classList.remove('scrollbar-grey');
        }
    }, [])

    return ReactDOM.createPortal(
        <div className='stopFollowing_dialogContainer'>
            <div onClick={closeDialog} className='stopFollowing_dialogBG'/>
            <div className='stopFollowing_dialog'>
                <Avatar
                    className='stopFollowing_avatar'
                    src={selectedUser.user.profile_pic}
                />
                <p className='stopFollowing_txt'>If you change your mind, you'll have to request to follow @{selectedUser.user.username} {' again'}</p>
                <div className='stopFollowing_btns'>
                    <button onClick={handleFollowing} className='stopFollowing_unfollowBtn'>Unfollow</button>
                    <button onClick={closeDialog} className='stopFollowing_cancelBtn'>Cancel</button>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default StopFollowing;