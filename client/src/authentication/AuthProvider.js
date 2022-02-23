import React, { useEffect, useState } from 'react';
import { AuthContext } from '../App';
import MessageAlert from './MessageAlert';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [autoLoginLoading, setAutoLoginLoading] = useState(true);
    const [signInLoading, setSignInLoading] = useState(false);
    const [messageProps, setMessageProps] = useState({
        displayMessage: false,
        message: '',
        isSuccess: false,
    });

    const register = async (newUser, beforeAuth, onError, onSuccess) => {
        setSignInLoading(true);
        beforeAuth();

        try {
            const res = await fetch('/register', {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.log(errorData);
                setSignInLoading(false);
                onError(errorData.message || errorData);
                return false;
            }

            const userData = await res.json();

            localStorage.setItem('token', userData.token);
            setUser({...userData, token: ''});

            setSignInLoading(false);
            onSuccess();
        } catch (error) {
            console.error(error);
            setSignInLoading(false);
            onError("Couldn't connect to the server, please try later");
        }
    }

    const signin = async (newUser, beforeAuth, onError, onSuccess) => {
        setSignInLoading(true);
        beforeAuth();

        try {
            const res = await fetch('/signin', {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.log(errorData);
                setSignInLoading(false);
                onError(errorData.message || errorData);
                return false
            }

            const userData = await res.json();

            localStorage.setItem('token', userData.token);
            setUser({...userData, token: ''});

            setSignInLoading(false);
            onSuccess();
        } catch (error) {
            console.error(error);
            setSignInLoading(false);
            onError(`Couldn't connect to the server, please try later`);
        }
    }

    const signout = (callback) => {
        localStorage.setItem('token', '');
        setUser(null);
        if (callback){
            callback();
        }
    }

    const checkToken = async () => {
        try {
            const res = await fetch('/is-verified', {
                method: 'GET',
                headers: { token: localStorage.token }
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.log(errorData);
                return false
            }

            const isTokenValid = await res.json();

            return isTokenValid.isValid;
        } catch (error) {
            console.error(error);
            setAutoLoginLoading(false);
        }
    }

    const autoLoginUser = async () => {
        if (!localStorage.token){
            setAutoLoginLoading(false);
            return false
        }

        setAutoLoginLoading(true);
        if (!await checkToken()) {
            setAutoLoginLoading(false);
            return false
        }

        try {
            const res = await fetch('/userData', {
                method: 'GET',
                headers: { token: localStorage.token }
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.log(errorData);
                setAutoLoginLoading(false);
                return
            }

            const userData = await res.json();
            setUser(userData);
            setAutoLoginLoading(false);
        } catch (error) {
            console.error(error);
            setAutoLoginLoading(false);
        }
    }

    const loadMessageAlert = (message, isSuccess) => {
        setMessageProps({
            displayMessage: true,
            message: message,
            isSuccess: isSuccess,
        })
    }

    useEffect(() => {
        autoLoginUser();
    }, [])

    const value = {
        user,
        setUser,
        register,
        signin,
        signout,
        autoLoginUser,
        loadMessageAlert,
        autoLoginLoading,
        signInLoading
    }

    return (
        <AuthContext.Provider value={value}>
            {
                messageProps.displayMessage && <MessageAlert messageProps={messageProps} setMessageProps={setMessageProps}/>
            }
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;