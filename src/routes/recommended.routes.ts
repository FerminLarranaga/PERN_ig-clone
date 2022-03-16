import { Router } from "express";
import {
    getRecommended
} from '../controllers/recommended.controllers';
import isAuthorized from "../middleware/authorization";

const router = Router();


router.get('/recommended', isAuthorized, getRecommended);

export default router;