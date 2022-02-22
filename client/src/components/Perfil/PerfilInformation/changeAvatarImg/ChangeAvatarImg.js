import React, { useEffect } from "react";
import ReactDOM from 'react-dom';
import { storage } from "../../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import PublishIcon from '@material-ui/icons/Publish';
import { LinearProgress } from "@material-ui/core";

import './ChangeAvatarImg.css';
import { useAuth } from "../../../../App";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(255,188,116, 0.60), rgba(167, 156, 208, 0.60))',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        maxHeight: 550,
        overflowY: 'auto',
        position: 'relative'
    },
    progressActive: {
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(255,188,116, 0.75), rgba(167, 156, 208, 0.75))',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        flexDirection: 'column',
        maxHeight: 550,
        overflowY: 'auto',
        opacity: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress);

function ChangeAvatarImg({ handleClose, open }) {
    const [newProfilePhoto, setNewProfilePhoto] = React.useState(null);
    const [imgPreviewSrc, setImgPreviewSrc] = React.useState('');
    const [progress, setProgress] = React.useState(0);
    const auth = useAuth();
    const classes = useStyles();

    const previewImg = (img) => {
        const reader = new FileReader();

        reader.onload = (evt) => {
            setImgPreviewSrc(evt.target.result);
        }

        reader.readAsDataURL(img.target.files[0]);
    }

    const handleImg = (evt) => {
        if (evt.target.files[0]) {
            setNewProfilePhoto(evt.target.files[0]);
            previewImg(evt);
        }
    }

    const handleUpload = async () => {
        if (progress !== 0) return
        setProgress(10);

        let childRutaStorage = newProfilePhoto.name + Math.random();

        const storageRef = ref(storage, `${auth.user.username}/profile_pic/${childRutaStorage}`);
        const uploadTask = uploadBytesResumable(storageRef, newProfilePhoto);

        uploadTask.on(
            'state_changed',

            (snapshot) => {
                const currentProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(currentProgress > 10 ? currentProgress : 10);
            },

            (error) => {
                console.error(error);
                alert(error.message);
            },

            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
                    const res = await fetch('/updateUserPhoto', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            token: localStorage.token
                        },
                        body: JSON.stringify({ newProfilePic: downloadURL })
                    });

                    if (!res.ok) {
                        console.error(res);
                    }

                    setProgress(0);
                    auth.autoLoginUser();
                    handleClose();
                    auth.loadMessageAlert('Successfuly changed photo', true);
                })
            }
        );
    }

    const deletePhoto = () => {
        setProgress(10);
        fetch('/updateUserPhoto', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.token
            },
            body: JSON.stringify({ newProfilePic: ''})
        }).then(async res => {
            if (!res.ok){
                auth.loadMessageAlert('Error while changing profile photo', false);
                console.error(res);
            }
            setProgress(0);
            auth.autoLoginUser();
            handleClose();
        }).catch(e => {
            auth.loadMessageAlert(e.message, false);
        })
    }

    useEffect(() => {
        document.body.style = 'overflow: hidden;';

        return () => {
            document.body.style = 'overflow: auto;';
        }
    }, [])

    return ReactDOM.createPortal(
        <div className='changeAvatarImg_dialogContainer'>
            <div onClick={handleClose} className='changeAvatarImg_BG'/>
            <div className={`changeAvatarImg_dialog ${progress && 'changeAvatarImg_dialogLoading'}`}>
                <h1 className="changeAvatarImg_dialogTitle">Cambiar foto del perfil</h1>
                {newProfilePhoto && <img alt={newProfilePhoto.name} src={imgPreviewSrc} className="imgPreview" />}
                {
                    progress > 0 && (
                        <div className='uploading_files'>
                            <BorderLinearProgress />
                        </div>
                    )
                }
                <div className='changeAvatarImg_btns'>
                    {
                        newProfilePhoto && (
                            <button onClick={handleUpload} className='changeAvatarImg_uploadBtn'>
                                <PublishIcon />
                            </button>
                        )
                    }
                    <div className='changeAvatarImg_changeImgBtnContainer'>
                        <label className="changeAvatarImg_changeImgBtn">
                            <input type="file" accept='image/*' className="file-input" onChange={handleImg} />
                            {/* SI YA SE SELECCIONO IMG, CAMBIAR LABEL DEL BOTON */}
                            {newProfilePhoto ? (
                                'Cambiar archivo'
                            ) : (
                                'Subir foto'
                            )}
                        </label>
                    </div>
                    <button onClick={deletePhoto} className='changeAvatarImg_deleteCurrentBtn'>Eliminar foto actual</button>
                    <button onClick={handleClose} className='changeAvatarImg_cancelBtn'>Cancelar</button>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ChangeAvatarImg;