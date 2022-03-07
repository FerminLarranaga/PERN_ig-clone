import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import ChangeAvatarImg from "./changeAvatarImg/ChangeAvatarImg";
import ViewUserSelectedProfileImg from './ViewUserSelectedProfileImg/ViewUserSelectedProfileImg';

import Avatar from "@material-ui/core/Avatar";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import "./PerfilInformation.css";
import { useAuth } from "../../../App";
import { useSelectedUser } from '../../../authentication/RequireAuthProfile';
import StopFollowing from "../../Dialogs/StopFollowing/StopFollowing";
import { CircularProgress } from "@material-ui/core";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function PerfilInformation() {
    // Abrir modal para cambiar foto perfil
    const [openChangeAvatar, setOpenChangeAvatar] = useState(false);
    const [openStopFollowing, setOpenStopFollowing] = useState(false);
    const [loadingFollow, setLoadingFollow] = useState(false);
    // VUSPI = ViewUserSelectedProfileImg
    const [openVUSPI, setOpenVUSPI] = useState(false);
    const selectedUser = useSelectedUser();
    const adminUser = useAuth();
    const user = selectedUser.user ? selectedUser.user : adminUser.user;
    const query = useQuery();
    const navigate = useNavigate();

    // Cerrar modal para cambiar foto perfil
    const closeChangeAvatar = () => {
        setOpenChangeAvatar(false);
        setOpenVUSPI(false);
        navigate(`/${user.username}`);
    }

    useEffect(() => {
        if (query.get("openProfileImg")) {
            selectedUser.user ? setOpenVUSPI(true) : setOpenChangeAvatar(true);
        } else {
            setOpenVUSPI(false);
            setOpenChangeAvatar(false);
        }
    }, [query]);

    const handleProfileImgBehaviour = () => {
        if (selectedUser.user && !selectedUser.user.profile_pic) return

        navigate("?openProfileImg=true");
    }

    const handleAvatarDivTitle = () => {
        if (selectedUser.user) {
            if (selectedUser.user.profilePhoto) {
                return 'Click to see profile photo';
            } else {
                return 'No profile image';
            }
        } else {
            if (user.profile_pic) {
                return 'Click to change profile photo';
            } else {
                return 'Click to add a profile photo';
            }
        }
    }

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

            adminUser.setUser({ ...adminUser.user, total_followed: adminUser.user.total_followed + 1});
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
        // Toda la informacion del perfil
        <div>
            <div className="perfilInformation">
                {/* AVATAR */}
                <Avatar
                    src={user.profile_pic}
                    className={`avatarContainer ${user.profile_pic && 'dim'}`}
                    title={handleAvatarDivTitle()}
                    onClick={handleProfileImgBehaviour}
                />
                {
                    // Si el state para abrir el modal de cambiar foto de
                    // perfil esta activo, abrirlo, sino no
                    selectedUser.user ? (
                        <ViewUserSelectedProfileImg
                            open={openVUSPI}
                            user={user}
                            handleClose={closeChangeAvatar}
                        />
                    ) : (
                        openChangeAvatar && <ChangeAvatarImg handleClose={closeChangeAvatar}/>
                    )
                }
                <div className="info">
                    <div className="fw3 username_and_btn">
                        <span style={{ fontSize: "min(30px, 6vw)" }}>{user.username}</span>
                        {
                            selectedUser.user ? (
                                !loadingFollow? (
                                    selectedUser.user.isFollowing ? (
                                        <div className='ml4' style={{ display: 'flex', alignItems: 'center' }}>
                                            <button onClick={() => setOpenStopFollowing(true)} className="isFollowingBtn f6 link fw4 dim br2 ba dib near-black pointer">
                                                <svg width="12" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 13.062V21H3.47932e-08C-0.00010582 19.8649 0.24133 18.7428 0.708267 17.7083C1.1752 16.6737 1.85695 15.7503 2.70822 14.9995C3.55948 14.2487 4.56078 13.6876 5.64557 13.3536C6.73037 13.0195 7.87384 12.9201 9 13.062V13.062ZM8 12C4.685 12 2 9.315 2 6C2 2.685 4.685 0 8 0C11.315 0 14 2.685 14 6C14 9.315 11.315 12 8 12ZM13.793 18.914L17.328 15.379L18.743 16.793L13.793 21.743L10.257 18.207L11.672 16.793L13.792 18.914H13.793Z" fill="#333333" />
                                                </svg>
                                            </button>
                                            <MoreHorizIcon className='ml3' />
                                        </div>
                                    ) : (
                                        <div className='ml4' style={{ display: 'flex', alignItems: 'center' }}>
                                            <button onClick={() => handleFollowing('POST')} className="followBtn f6 link fw4 br2 ba dib near-black pointer">Seguir</button>
                                            <MoreHorizIcon className='ml3' />
                                        </div>
                                    )
                                ) : (
                                    <div className="ml4 flex items-center">
                                        <div className='perfilInfo_loadingUnfollow'>
                                            <CircularProgress style={{width: '20px', height: '20px'}}/>
                                        </div>
                                        <MoreHorizIcon className='ml3' />
                                    </div>
                                )
                            ) : (
                                <Link className="f6 link fw4 dim br2 ba ph3 pv2 dib near-black ml4 pointer" to='/accounts/edit'>Editar perfil</Link>
                            )
                        }
                    </div>
                    <ul className="p_f_f followsInfo">
                        <li className="mr5">
                            <span className="fw5">{user.total_posts}</span> publicaciones
                        </li>
                        <li className="mr5">
                            <span className="fw5">{user.total_followers}</span> seguidores
                        </li>
                        <li>
                            <span className="fw5">{user.total_followed}</span> seguidos
                        </li>
                    </ul>
                    <div className="biografy">
                        <p className="fw5 biografy__name">{user.full_name}</p>
                        <p className="biografy__description">{user.description}</p>
                        <a style={{textDecoration: 'none'}} href={user.web_site} target='_blank'>
                            <div className="user_webSite">
                                {user.web_site?.replace(/^https?:\/\//, '')}
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <div style={{ display: 'none' }} className='mobileTablet_followInfo'>
                <div>
                    <p style={{ color: 'black' }} className='ma2 fw6'>{user.total_posts}</p>
                    <p className='ma0'>publicaciones</p>
                </div>
                <div>
                    <p style={{ color: 'black' }} className='ma2 fw6'>{user.total_followers}</p>
                    <p className='ma0'>seguidores</p>
                </div>
                <div>
                    <p style={{ color: 'black' }} className='ma2 fw6'>{user.total_followed}</p>
                    <p className='ma0'>seguidos</p>
                </div>
            </div>
            {
                openStopFollowing &&
                (
                    <StopFollowing
                        closeDialog={() => setOpenStopFollowing(false)}
                        startLoading={() => setLoadingFollow(true)}
                        stopLoading={() => setLoadingFollow(false)}
                        postsUser={false}
                    />
                )
            }
        </div>
    );
}

export default PerfilInformation;