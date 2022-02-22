import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../App';
import { useNavigate, useLocation } from 'react-router-dom';
import { storage } from '../../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import PostAddIcon from '@material-ui/icons/PostAdd';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { TextareaAutosize, LinearProgress } from '@material-ui/core';

import "./AddPost.css";

// Estilos del modal
const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paper: {
        boxShadow: theme.shadows[5]
    },
    progressActive: {
        pointerEvents: 'none',
        boxShadow: theme.shadows[5]
    }
}));

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress);

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function AddPost() {
    const classes = useStyles();
    const [open, setOpen] = useState(false); // Modal abierto o cerrado
    const navigate = useNavigate();
    const query = useQuery();
    const auth = useAuth();

    const [img, setImg] = useState(null); // Imagen seleccionada a subir
    const [imgFormat, setImgFormat] = useState('');
    const [imgPreviewSrc, setImgPreviewSrc] = useState(''); // source de la imagen seleccionada
    const [progress, setProgress] = useState(0); // Porgreso de carga de imagen
    const [caption, setCaption] = useState(''); // Descripcion del posteo
    const [videoDuration, setVideoDuration] = useState(0);

    useEffect(() => {
        if (query.get("addPost")) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [query])

    // Abrir modal
    const handleOpen = () => {
        navigate(`?addPost=true`)
    };

    // Cerrar modal y resetear states
    const handleClose = () => {
        setImg(null);
        setImgPreviewSrc('');
        setCaption('');
        setProgress(0);
        navigate(-1);
    };

    // Obtener src de la imagen para mostart preview
    const previewImg = (img) => {
        const reader = new FileReader();

        reader.onload = (evt) => {
            setImgPreviewSrc(evt.target.result);
        }

        reader.readAsDataURL(img.target.files[0]);
    }

    // Obtener imagen
    const handleImg = (evt) => {
        const file = evt.target.files[0];
        if (file) {
            const fileFormat = validateFormat(file);
            if (fileFormat) {
                console.log(file);
                setImg(file);
                setImgFormat(fileFormat);
                previewImg(evt);
            }
        }
    }

    const handleUpload = () => {
        if (progress) return false;

        setProgress(10);
        // Crear ruta de subida en storage y poner img
        let childRutaStorage = img.name + Math.random();

        const storageRef = ref(storage, `${auth.user.username}/posts_${imgFormat + 's'}/${childRutaStorage}`);
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
            'state_changed',

            // Mientras se realiza la subida actualizamos el progreso
            (snapshot) => {
                const currentProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(currentProgress > 10 ? currentProgress : 10);
            },

            // Manejo de errores
            (err) => {
                console.log(err);
                alert(err.message);
            },

            // Cuando se haya completado la subida obtenemos el
            // link de descarga y actualizamos la base de datos
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
                    const res = await fetch('/posts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            token: localStorage.token
                        },
                        body: JSON.stringify(getDB_PreparedImgObj(downloadURL))
                    })
                    if (!res.ok) {
                        const errorData = await res.json();
                        console.log(errorData.message);
                    }
                    // auth.setUser({...auth.user, total_posts: auth.user.total_posts + 1});
                    auth.autoLoginUser();
                    handleClose();
                    auth.loadMessageAlert('Successfuly uploaded post', true)
                })
            }
        )
    }

    const getDB_PreparedImgObj = (imgUrl) => {
        const imgObj = {
            post_date: new Date(),
            caption: caption,
            image_url: imgUrl,
            file_format: imgFormat,
        }

        if (imgFormat === 'vid') {
            imgObj.vid_duration = videoDuration;
        }

        return imgObj;
    }

    const validateFormat = (file) => {
        if (file.type.includes('video')) {
            return 'vid';
        } else if (file.type.includes('image')) {
            return 'img';
        }

        auth.loadMessageAlert('Please select a valid media format')
    }

    return (
        <div>
            {/* Icono de posteo */}
            <PostAddIcon
                fontSize="large"
                className="pointer dim"
                onClick={handleOpen} />
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={!progress && handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open} tabIndex='Force tabindex not to work xd'>
                    {/* INTERIOR DEL MODAL */}
                    <div className="addPostModal_container">
                        <div className={(progress > 0 ? classes.progressActive : classes.paper) + ' modalScrollbar addPostModal'}>
                            {/* TITULO */}
                            <div className='addPostModal_header'>
                                <h1>Crear una nueva publicación</h1>
                            </div>

                            {/* SI YA SE SELECCIONO UNA IMAGEN, MOSTRAMOS LA PREVIEW
                        CASO CONTRARIO, DECIMOS QUE NO SE SELECIONO */}
                            <div className='addPostModal_selectSection' style={{ height: !img ? '100%' : 'fit-content' }}>
                                {img ? (
                                    imgFormat === 'img' ? (
                                        <img alt={img.name} src={imgPreviewSrc} className="imgPreview" />
                                    ) : (
                                        <video controls src={imgPreviewSrc} onDurationChangeCapture={(evt) => setVideoDuration(evt.target.duration)} className='imgPreview' />
                                    )
                                ) : (
                                    <div className="mb3 fw6">
                                        <svg aria-label="Icono para representar contenido multimedia, como imágenes o videos" class="_8-yf5 " color="#262626" fill="#262626" height="77" role="img" viewBox="0 0 97.6 77.3" width="96">
                                            <path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor">
                                            </path>
                                            <path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor">
                                            </path>
                                            <path d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor">
                                            </path>
                                        </svg>
                                    </div>
                                )}

                                {
                                    img && (
                                        < div className='captionContainer'>
                                            <TextareaAutosize onChange={(e) => setCaption(e.target.value)} placeholder="Escribe una descripción..." className="br2 caption" />
                                        </div>
                                    )
                                }

                                {/* MIENTRAS SE SUBE IMG, MOSTRAR PROGRESO */}
                                {
                                    progress > 0 && (
                                        <div className='uploading_files'>
                                            <BorderLinearProgress variant='determinate' value={progress} />
                                        </div>
                                    )
                                }

                                {/* BOTON PARA ELEGIR ARCHIVO */}
                                <div className="choose_file">
                                    <label className={`ba br2 ${img ? 'changeFile_btn' : 'btn-file'}`}>
                                        <input type="file" accept='video/*, image/*' className="file-input" onChange={handleImg} />
                                        {/* SI YA SE SELECCIONO IMG, CAMBIAR LABEL DEL BOTON */}
                                        {img ? (
                                            'Cambiar archivo'
                                        ) : (
                                            'Seleccionar archivo'
                                        )}
                                    </label>
                                    {/* SI YA SE SELECCIONO IMG, MOSTRAR BOTON DE SUBIDA */}
                                    {img && progress === 0 && (
                                        <div className="upload_btn">
                                            <button onClick={() => { handleUpload() }}>
                                                {'Compartir'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* {img ? (<h5>Tamaño: {Math.trunc(img?.size / 1000) + ' kb'}</h5>) : ''} */}
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div >
    );
}