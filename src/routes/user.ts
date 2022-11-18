import { Router } from 'express';
import { authorize } from '../middlewares/authMiddleware';
import {
  getInfoUser,
  login,
  register,
  seedUser,
} from '../controllers/userController';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/getInfo', authorize(['ADMIN', 'USER']), getInfoUser);

router.post('/seedUser', seedUser);

export default router;
