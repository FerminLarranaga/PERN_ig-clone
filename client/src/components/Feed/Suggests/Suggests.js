import { Avatar } from '@material-ui/core';
import React from 'react';
import './Suggests.css';

const Suggests = () => {
    return (
        <div className='suggests_container'>
            <h4 className='suggests_containerTitle'>Sugerencias para ti</h4>
            <div className='suggests_section'>

                <div className='suggests_user'>
                    <div className='suggests_userInfo'>
                        <Avatar
                            className='suggests_userInfoAvatar'
                        />
                        <div className='suggests_userInfoTxt'>
                            <span className='suggests_userUsername'>Username</span>
                            <span className='suggests_userFullName'>Real Name</span>
                            <span className='suggests_userPopular'>Popular</span>
                        </div>
                    </div>
                    <button onClick={() => { }} className="suggests_followBtn">Seguir</button>
                </div>

                <div className='suggests_user'>
                    <div className='suggests_userInfo'>
                        <Avatar
                            className='suggests_userInfoAvatar'
                        />
                        <div className='suggests_userInfoTxt'>
                            <span className='suggests_userUsername'>Username</span>
                            <span className='suggests_userFullName'>Real Name</span>
                            <span className='suggests_userPopular'>Popular</span>
                        </div>
                    </div>
                    <button onClick={() => { }} className="suggests_followBtn">Seguir</button>
                </div>

                <div className='suggests_user'>
                    <div className='suggests_userInfo'>
                        <Avatar
                            className='suggests_userInfoAvatar'
                        />
                        <div className='suggests_userInfoTxt'>
                            <span className='suggests_userUsername'>Username</span>
                            <span className='suggests_userFullName'>Real Name</span>
                            <span className='suggests_userPopular'>Popular</span>
                        </div>
                    </div>
                    <button onClick={() => { }} className="suggests_followBtn">Seguir</button>
                </div>

                <div className='suggests_user'>
                    <div className='suggests_userInfo'>
                        <Avatar
                            className='suggests_userInfoAvatar'
                        />
                        <div className='suggests_userInfoTxt'>
                            <span className='suggests_userUsername'>Username</span>
                            <span className='suggests_userFullName'>Real Name</span>
                            <span className='suggests_userPopular'>Popular</span>
                        </div>
                    </div>
                    <button onClick={() => { }} className="suggests_followBtn">Seguir</button>
                </div>
                
                <div className='suggests_user'>
                    <div className='suggests_userInfo'>
                        <Avatar
                            className='suggests_userInfoAvatar'
                        />
                        <div className='suggests_userInfoTxt'>
                            <span className='suggests_userUsername'>Username</span>
                            <span className='suggests_userFullName'>Real Name</span>
                            <span className='suggests_userPopular'>Popular</span>
                        </div>
                    </div>
                    <button onClick={() => { }} className="suggests_followBtn">Seguir</button>
                </div>

                <div className='suggests_user'>
                    <div className='suggests_userInfo'>
                        <Avatar
                            className='suggests_userInfoAvatar'
                        />
                        <div className='suggests_userInfoTxt'>
                            <span className='suggests_userUsername'>Username</span>
                            <span className='suggests_userFullName'>Real Name</span>
                            <span className='suggests_userPopular'>Popular</span>
                        </div>
                    </div>
                    <button onClick={() => { }} className="suggests_followBtn">Seguir</button>
                </div>

                <div className='suggests_user'>
                    <div className='suggests_userInfo'>
                        <Avatar
                            className='suggests_userInfoAvatar'
                        />
                        <div className='suggests_userInfoTxt'>
                            <span className='suggests_userUsername'>Username</span>
                            <span className='suggests_userFullName'>Real Name</span>
                            <span className='suggests_userPopular'>Popular</span>
                        </div>
                    </div>
                    <button onClick={() => { }} className="suggests_followBtn">Seguir</button>
                </div>
            </div>
        </div>
    )
}

export default Suggests;