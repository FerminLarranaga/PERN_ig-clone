import React from 'react';
import './ViewUserSelectedProfileImg.css';

import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';

function ViewUserSelectedProfileImg({ open, handleClose, user }) {
    const useStyles = makeStyles((theme) => ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }
    }));

    const classes = useStyles();

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            class={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{timeout: 500}}
        >
            <Fade in={open}>
                <img src={user.profile_pic} style={{objectFit: 'contain', height: '70%'}} alt='profilePhoto'/>
            </Fade>
        </Modal>
    );
}

export default ViewUserSelectedProfileImg;