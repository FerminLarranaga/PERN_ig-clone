import { Router } from 'express';
import isAuthorized from '../middleware/authorization';
import {
    getComments,
    getSingleComment,
    postComment,
    updateComment,
    deleteComment
} from '../controllers/comments.controllers';

const router = Router();

router.get('/:post_id', getComments);

router.get('/:post_id/:comment_id', getSingleComment);

router.post('/:post_id', isAuthorized, postComment);

router.patch('/:comment_id', isAuthorized, updateComment);

router.delete('/:comment_id', isAuthorized, deleteComment);

export default router;