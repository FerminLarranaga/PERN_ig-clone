import { Router } from 'express';
import isAuthorized from '../middleware/authorization';
import {
    getPosts,
    getSinglePost,
    uploadPost,
    updatePost,
    deletePost,
    getFollowingPosts
}
from '../controllers/posts.controllers';

const router = Router();

router.get('/getFollowingPosts', isAuthorized, getFollowingPosts);

router.get('/:username', getPosts);

router.get('/p/:postId', getSinglePost);

router.post('/', isAuthorized, uploadPost);

router.patch('/:postId', isAuthorized, updatePost);

router.delete('/:postId', isAuthorized, deletePost);

export default router;