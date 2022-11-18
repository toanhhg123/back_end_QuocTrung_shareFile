import { Router } from 'express';
import {
  getAllSubject,
  getAllSubjectsBySpecializedId,
} from '../controllers/subjectController';

const router = Router();

router.get('/', getAllSubject);
router.get('/specialized/:id', getAllSubjectsBySpecializedId);

export default router;
