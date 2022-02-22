import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import trimUserData from '../../util/trimUserData';
import instagramTitle from '../../assets/instagramTitle.png';
import { useAuth } from '../../App';
import './Auth.css';
import validInfo from '../../util/validInfo';

const Register = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [inputData, setInputData] = useState({
        fullName: {
            value: '',
            isValid: false
        },
        username: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        },
        confirmPassword: {
            value: '',
            isValid: false
        }
    })

    function registerUser(evt) {
        evt.preventDefault();

        const formData = new FormData(evt.currentTarget);
        const newUser = trimUserData({
            fullName: formData.get('fullName'),
            username: formData.get('username'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        });

        const isValidUserData = validInfo(Object.values(newUser));

        if (!isValidUserData.isValid) {
            auth.loadMessageAlert(isValidUserData.message, false);
            return
        }

        auth.register(newUser,
            () => {

            },

            (errorMessage) => {
                auth.loadMessageAlert(errorMessage, false);
            },
            
            () => {
                const from = location.state?.from?.pathname || '/';
                evt.target.reset();
                navigate(from, { replace: true });
            }
        );
    }

    const checkValue = (evt) => {
        const value = evt.target.value;
        let isValid = false;

        if (evt.target.name !== 'confirmPassword'){
            isValid = validInfo([value]).isValid;
        } else {
            if (inputData.password.isValid && inputData.password.value === value){
                isValid = true;
            }
        }

        const newInputData = {
            ...inputData,
            [evt.target.name]: {
                value: value,
                isValid: isValid
            }
        }

        if (Object.values(newInputData).every(({isValid}) => isValid)){
            const submitBtn = evt.target.form[4];
            submitBtn.disabled = false;
        } else {
            const submitBtn = evt.target.form[4];
            submitBtn.disabled = true;
        }

        setInputData(newInputData);
    }

    const loadPlaceHolderAnim = (evt) => {
        const parent = evt.target.labels[0];
        if (evt.target.value.length > 0 && !parent.classList.contains('registerForm_labelAnim')) {
            parent.classList.add('registerForm_labelAnim');
        } else if (evt.target.value.length === 0) {
            parent.classList.remove('registerForm_labelAnim');
        }
    }

    const loadBorderAnim = (evt) => {
        const container = evt.target.parentElement.parentElement;
        container.classList.add('fieldIsFocused');
    }

    const deLoadBorderAnim = (evt) => {
        const container = evt.target.parentElement.parentElement;
        container.classList.remove('fieldIsFocused');
    }

    useEffect(() => {
        if (auth.autoLoginLoading)
            return
        
        if (auth.user){
            navigate(`/${auth.user.username}`);
        }
    }, [auth.autoLoginLoading]);

    if (auth.autoLoginLoading)
        return ''

    return (
        <div className='registerContainer'>
            <div className='registerSubContainer'>
                <div className='formContainer'>
                    <img className='instagramIMGTitle' src={instagramTitle} alt='instagram logo' />
                    <form className='registerForm' onSubmit={registerUser}>
                        <h2 className='registerForm_title'>Sign up to see photos and videos from your friends.</h2>
                        <div className='registerForm_fieldContainer'>
                            <div className='registerForm_field'>
                                <label className='registerForm_label'>
                                    <span className='registerForm_labelSpan'>Full Name</span>
                                    <input
                                        name='fullName'
                                        className='registerForm_input'
                                        type='text'
                                        autoCapitalize='sentences'
                                        required
                                        autoCorrect='false'
                                        autoComplete='name'
                                        minLength={5}
                                        maxLength={50}
                                        onChange={(evt) => {
                                            loadPlaceHolderAnim(evt);
                                            checkValue(evt);
                                        }}
                                        onFocus={loadBorderAnim}
                                        onBlur={deLoadBorderAnim}
                                        value={inputData.fullName.value}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className='registerForm_fieldContainer'>
                            <div className='registerForm_field'>
                                <label className='registerForm_label'>
                                    <span className='registerForm_labelSpan'>Username</span>
                                    <input
                                        name='username'
                                        className='registerForm_input'
                                        type='text'
                                        autoCapitalize='off'
                                        required
                                        autoCorrect='off'
                                        maxLength={30}
                                        minLength={5}
                                        onChange={(evt) => {
                                            loadPlaceHolderAnim(evt);
                                            checkValue(evt);
                                        }}
                                        onFocus={loadBorderAnim}
                                        onBlur={deLoadBorderAnim}
                                        value={inputData.username.value}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className='registerForm_fieldContainer'>
                            <div className='registerForm_field'>
                                <label className='registerForm_label'>
                                    <span className='registerForm_labelSpan'>Password</span>
                                    <input
                                        name='password'
                                        className='registerForm_input'
                                        type='password'
                                        autoCapitalize='off'
                                        required
                                        autoCorrect='off'
                                        autoComplete='new_password'
                                        minLength={5}
                                        maxLength={35}
                                        onChange={(evt) => {
                                            loadPlaceHolderAnim(evt);
                                            checkValue(evt);
                                        }}
                                        onFocus={loadBorderAnim}
                                        onBlur={deLoadBorderAnim}
                                        value={inputData.password.value}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className='registerForm_fieldContainer'>
                            <div className='registerForm_field'>
                                <label className='registerForm_label'>
                                    <span className='registerForm_labelSpan'>Confirm Password</span>
                                    <input
                                        name='confirmPassword'
                                        className='registerForm_input'
                                        type='password'
                                        autoCapitalize='off'
                                        required
                                        autoCorrect='off'
                                        autoComplete='off'
                                        minLength={5}
                                        maxLength={35}
                                        onChange={(evt) => {
                                            loadPlaceHolderAnim(evt);
                                            checkValue(evt);
                                        }}
                                        onFocus={loadBorderAnim}
                                        onBlur={deLoadBorderAnim}
                                        value={inputData.confirmPassword.value}
                                    />
                                </label>
                            </div>
                        </div>
                        <button className='registerSubmitBtn' type='submit' disabled>Sign Up</button>
                    </form>
                </div>
                <div className='redirectToSignInContainer'>
                    <p className='redirectToSignIn'>
                        {"Have an account? "}
                        <Link className='redirectToSignIn_link' to='/login'>Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register;