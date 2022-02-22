import React from 'react';
import { useAuth } from '../../../../App';

import { Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { ListItemText, ListItemIcon } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import "./Modal.css";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function LogOutModal({ StyledMenuItem, closeMenu }) {
  const auth = useAuth();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false); // Abrir o cerrar modal

  // Abrir modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Cerrar modal
  const handleClose = () => {
    setOpen(false);
  };

  return(
    <div>
      {/* BOTON DEL MENU */}
      <StyledMenuItem onClick={() => {handleOpen(); closeMenu()}}>
        <ListItemIcon>
          <ExitToAppIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Cerrar sesión</ListItemText>
      </StyledMenuItem>
      {/* ESTILOS DEL MODAL */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          {/* INTERIOR DEL MODAL */}
          <div className={classes.paper}>
            {/* TITULO */}
            <h2 id="transition-modal-title">Seguro deseas cerrar sesión?</h2>
            {/* BOTON PARA DESLOGUEARSE */}
            <Button onClick={() => auth.signout()}>Cerrar sesión</Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
