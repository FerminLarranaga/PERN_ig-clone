import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { SelectedUserContext } from '../authentication/RequireAuthProfile';

const SelectedUserProvider = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [loadingSelectedUser, setLoadingSetSelectedUser] = useState(true);
    const { username } = useParams();
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.user.username === username) {
            setLoadingSetSelectedUser(false);
            setSelectedUser(null);
            return
        }

        setLoadingSetSelectedUser(true);
        
        fetch(`/userData/${username}`, {
            method: 'GET',
            headers: { token: localStorage.token }
        }).then(async res => {
            if (!res.ok) {
                navigate(`/${auth.user.username}`);
                return
            }
            const user = await res.json();
            console.log(user);
            setSelectedUser(user);
        }).catch(e => {
            navigate(`/${auth.user.username}`);
            console.error(e);
        }).finally(() => {
            setLoadingSetSelectedUser(false);
        })
    }, [username]);

    return (
        <SelectedUserContext.Provider value={{user: selectedUser, setUser: setSelectedUser}}>
            {
                loadingSelectedUser? 'LOADING SELECTED USER' : children
            }
        </SelectedUserContext.Provider>
    )
}

export default SelectedUserProvider;