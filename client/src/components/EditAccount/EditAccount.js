import React, { useRef, useState } from 'react';
import './EditAccount.css';
import { useAuth } from '../../App';
import { Avatar } from '@material-ui/core';

const EditAccount = () => {
    const auth = useAuth();
    const submitBtnRef = useRef();
    const [formData, setFormData] = useState({
        full_name: auth.user.full_name,
        username: auth.user.username,
        web_site: auth.user.web_site,
        description: auth.user.description
    })

    const updateFormData = (evt) => {
        const value = evt.target.value;
        const name = evt.target.name;
        setFormData({...formData, [name]: value});
        submitBtnRef.current.disabled = false;
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        submitBtnRef.current.disabled = true;

        const formFields = {...formData};

        const iswebSiteValid = !Boolean(formData.web_site) || Boolean(formData.web_site.match(new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)));
        if (iswebSiteValid && Boolean(formData.web_site)){
            const hasHTTP = Boolean(formData.web_site.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)));
            if(!hasHTTP) formFields.web_site = 'http://' + formData.web_site;
        }
        const isUsernameValid = formData.username.length > 4 && formData.username.length < 35;
        const isFullNameValid = formData.full_name.length > 4 && formData.full_name.length < 35;
        const isDescriptionValid = !Boolean(formData.description) || formData.description.length < 255;

        let isInfoValid = {
            full_name: isFullNameValid,
            username: isUsernameValid,
            web_site: iswebSiteValid,
            description: isDescriptionValid
        };

        if (!(Object.values(isInfoValid).every(Boolean))) return

        fetch('/updateUser', {
            method: 'PUT',
            headers: {
                token: localStorage.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formFields)
        }).then(async res => {
            if (!res.ok){
                const errorData = await res.json();
                auth.loadMessageAlert(errorData?.message);
            }

            auth.autoLoginUser();
        }).catch(error => {
            console.error(error);
        })
    }

    return (
        <div className='flex'>
            <div className='editAcc_container'>
                <div className='editAcc_avatarContainer'>
                    <Avatar
                        src={auth.user.profile_pic}
                        className='editAcc_avatar'
                    />
                    <div className='editAcc_changeProfilePic'>
                        <span>{auth.user.username}</span>
                        <button>Cambiar foto de perfil</button>
                    </div>
                </div>
                <form className='editAcc_form' method='PUT' onSubmit={handleSubmit}>
                <div className='editAcc_field'>
                        <aside className='editAcc_fieldName'>
                            <label>Nombre</label>
                        </aside>
                        <div className='editAcc_inputContainer'>
                            <input
                                type='text'
                                name='full_name'
                                className='editAcc_input'
                                placeholder='Nombre'
                                value={formData.full_name}
                                onChange={updateFormData}
                            />
                            <p className='editAcc_inputDesc'>
                                Para ayudar a que las personas descubran tu cuenta, usa el nombre por el que te conoce la gente, ya sea tu nombre completo, apodo o nombre comercial.
                            </p>
                        </div>
                    </div>
                    <div className='editAcc_field'>
                        <aside className='editAcc_fieldName'>
                            <label>Nombre de usuario</label>
                        </aside>
                        <div className='editAcc_inputContainer'>
                            <input
                                type='text'
                                name='username'
                                className='editAcc_input'
                                placeholder='Nombre de usuario'
                                value={formData.username}
                                onChange={updateFormData}
                            />
                        </div>
                    </div>
                    <div className='editAcc_field'>
                        <aside className='editAcc_fieldName'>
                            <label>Sitio web</label>
                        </aside>
                        <div className='editAcc_inputContainer'>
                            <input
                                type='text'
                                name='web_site'
                                className='editAcc_input'
                                placeholder='Sitio web'
                                value={formData.web_site}
                                onChange={updateFormData}
                            />
                        </div>
                    </div>
                    <div className='editAcc_field'>
                        <aside className='editAcc_fieldName'>
                            <label>Presentación</label>
                        </aside>
                        <div className='editAcc_inputContainer'>
                            <input
                                type='text'
                                name='description'
                                className='editAcc_input'
                                placeholder='Presentación'
                                value={formData.description}
                                onChange={updateFormData}
                            />
                        </div>
                    </div>
                    <div className='editAcc_field'>
                        <aside className='editAcc_fieldName'>
                            <label></label>
                        </aside>
                        <button
                            ref={submitBtnRef}
                            className='editAcc_formSubmit followBtn f6 link fw4 br2 ba dib near-black pointer'
                            type='submit'
                            disabled
                        >Aceptar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditAccount;