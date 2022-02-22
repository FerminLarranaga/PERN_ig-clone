import React, { createContext, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import SelectedUserProvider from './SelectedUserProvider';

const RequireAuthProfile = ({children}) => {
    const auth = useAuth();
    const location = useLocation();

    if (!auth.user && !auth.autoLoginLoading)
        return <Navigate to='/register' state={{ from: location }} replace/>

    if (auth.autoLoginLoading)
        return 'LOADING...'

    return (
        <SelectedUserProvider>
            {children}
        </SelectedUserProvider>
    );
}

export const SelectedUserContext = createContext(null);

export function useSelectedUser(){
    return useContext(SelectedUserContext);
}

export default RequireAuthProfile;