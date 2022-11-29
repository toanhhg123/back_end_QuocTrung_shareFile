import { Router } from 'express';
import { authorize } from '../middlewares/authMiddleware';
import {
  createUser,
  deleteUser,
  getAllUserAdmin,
  getInfoUser,
  login,
  register,
  seedUser,
  updateUser,
} from '../controllers/userController';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/getInfo', authorize(['ADMIN', 'USER']), getInfoUser);
router.get('/getAllUserAdmin', authorize(['ADMIN']), getAllUserAdmin);
router.post('/create', authorize(['ADMIN']), createUser);
router.delete('/delete/:id', authorize(['ADMIN']), deleteUser);
router.patch('/update/:id', authorize(['ADMIN']), updateUser);

router.post('/seedUser', seedUser);

export default router;
