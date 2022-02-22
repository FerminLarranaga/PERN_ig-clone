import { Router } from "express";
import isAuthorized from "../middleware/authorization";
import validInfo from "../middleware/validInfo";
import { isVerified, register, signin, getUserData, getUsers, updateUserPhoto, getSelectedUserData, updateUser } from '../controllers/auth.controllers';

const router = Router();

router.post('/signin', validInfo, signin);

router.post('/register', validInfo, register);

router.get('/is-verified', isAuthorized, isVerified);

router.get('/userData', isAuthorized, getUserData);

router.get('/userData/:username', isAuthorized, getSelectedUserData);

router.get('/getUsers', isAuthorized, getUsers);

router.patch('/updateUserPhoto', isAuthorized, updateUserPhoto);

router.put('/updateUser', isAuthorized, updateUser);

export default router;