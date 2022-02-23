import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './LogOut.css';
import { useAuth } from '../../../App';

const LogOut = ({ closeDialog }) => {
    const auth = useAuth();

    useEffect(() => {
        document.body.style = 'overflow: hidden;';

        return () => {
            document.body.style = 'overflow: auto;';
        }
    }, [])

    return ReactDOM.createPortal(
        <div className='stopFollowing_dialogContainer'>
            <div onClick={closeDialog} className='stopFollowing_dialogBG'/>
            <div className='stopFollowing_dialog'>
                <h1 className='changeAvatarImg_dialogTitle'>¿Deseas cerrar sesión?</h1>
                <p className='stopFollowing_txt' style={{margin: '0 27px 27px'}}>Deberas volver a iniciar sesión con tu nombre de usuario y contraseña</p>
                <div className='stopFollowing_btns'>
                    <button onClick={() => auth.signout()} className='stopFollowing_unfollowBtn'>Cerrar sesión</button>
                    <button onClick={closeDialog} className='stopFollowing_cancelBtn'>Cancelar</button>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default LogOut;