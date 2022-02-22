import { Router } from "express";
import isAuthorized from "../middleware/authorization";
import { startFollowing, stopFollowing, getFollowers, getFollowing, isFollowed, isFollowing } from "../controllers/following.controllers";

const router = Router();

router.get('/getFollowing', isAuthorized, getFollowing);

router.get('/getFollowers', isAuthorized, getFollowers);

router.get('/isFollowing', isAuthorized, isFollowing);

router.get('/isFollowed', isAuthorized, isFollowed);

router.post('/startFollowing', isAuthorized, startFollowing);

router.delete('/stopFollowing', isAuthorized, stopFollowing);

export default router;