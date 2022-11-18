import { Router } from 'express';
import { getAllSchool, seedSchool } from './../controllers/shoolController';
import { authorize } from './../middlewares/authMiddleware';
import { TYPE_USER } from '../models/user';

const router = Router();

router.get('/seed', seedSchool);
router.get('/', getAllSchool);

export default router;
