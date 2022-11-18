import { Router } from 'express';
import { getAllSpecialized } from '../controllers/specializedController';

const router = Router();

router.get('/', getAllSpecialized);

export default router;
