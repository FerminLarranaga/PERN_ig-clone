import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from '../../../../App';
import { useSelectedUser } from "../../../../authentication/RequireAuthProfile";

import OnClickPost from "./onClickPost/OnClickPost";

import FavoriteIcon from '@material-ui/icons/Favorite';
import ModeCommentRoundedIcon from '@material-ui/icons/ModeCommentRounded';

import "./PerfilPosts.css";
import PlayCircleFilledOutlinedIcon from '@material-ui/icons/PlayCircleFilledOutlined';
import { useNavigate, useLocation, useParams } from "react-router-dom";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function PerfilPosts() {
    const [posts, setPosts] = useState([]);
    const [openPost, setOpenPost] = useState(false);
    const navigate = useNavigate();
    const query = useQuery();
    const selectedUser = useSelectedUser().user;
    // const adminUser = useAuth().user;
    // const user = selectedUser ? selectedUser : adminUser;
    const params = useParams();

    useEffect(() => {
        if (query.get("postId")) {
            setOpenPost(true);
        } else {
            setOpenPost(false);
        }
    }, [query])

    useEffect(() => {
        // console.log(`PerfilPosts's User: ${user.username}`);
        fetch(`/posts/${params.username}`, {
            method: 'GET',
            headers: { token: localStorage.token }
        }).then(async res => {
            if (!res.ok) {
                const errorData = await res.json();
                console.error(errorData);
                setPosts([]);
                return
            }
            setPosts(await res.json());
        }).catch((e) => {
            console.error(e.message);
        })
        
    }, [params.username]);

    const OpenPostFunc = (id) => {
        setOpenPost(true);
        navigate(`?postId=${id}`);
        // console.log(query.get("postId"));
    }

    // const updatePostLoaded = () => {
    //     postsLoaded.push(true);
    //     if (posts.length === postsLoaded.length) {
    //         console.log('IMGS LOADED');
    //         setImgsLoaded(true)
    //     };
    // }

    return (
        <div className="mt3 perfil_posts_container">
            {/* { // eslint-disable-next-line
                function () { return useMemo(() => getAllPosts(posts), [posts]) }()
            } */}
            {
                posts.map(({ id, compressed_url, image_url, file_format, vid_duration }) => (
                    <div key={id} className='perfil__post'>
                        <div className="img_and_info" id={id} onClick={() => OpenPostFunc(id)}>
                            {
                                file_format === 'img' ? (
                                    <img alt="" src={compressed_url} className="perfil__image" /*onLoad={updatePostLoaded}*/ />
                                ) : (
                                    <div className='img_and_info'>
                                        <video src={image_url + '#t=0.1'} className='perfil__image' /*onLoadedData={updatePostLoaded}*/ />
                                        <div className='videoInfo'>
                                            <div className='videoInfo_items'>
                                                <PlayCircleFilledOutlinedIcon className='mr2' fontSize='large' />
                                                <h5>{Math.trunc(vid_duration) + ' s'}</h5>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            <div className="imgInfo">
                                <div className="likes">
                                    <FavoriteIcon />
                                    <span className="ml1">2500</span>
                                </div>
                                <div className="comments">
                                    <ModeCommentRoundedIcon />
                                    <span className="ml1">55</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
            <OnClickPost
                open={openPost}
                setOpen={setOpenPost}
                postId={query.get("postId")}
                isAdmin={Boolean(!selectedUser)}
                isFollowing={selectedUser?.isFollowing}
            />
        </div>
    );
}

export default PerfilPosts;