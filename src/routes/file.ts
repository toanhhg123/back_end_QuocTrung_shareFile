import { Router } from 'express';
import multer from 'multer';
import { upload } from '../config/multer';
import {
  delefile,
  uploadFile,
  getAllFile,
  getAllFilePublic,
  uploadFileServer,
  getAllFilePublicServer,
  updateFile,
  deleteFile,
} from '../controllers/fileController';
import { authorize } from '../middlewares/authMiddleware';
const router = Router();

router.post('/upload', authorize(['USER']), upload.single('file'), uploadFile);
router.post(
  '/uploadServer',
  authorize(['USER', 'ADMIN']),
  upload.single('file'),
  uploadFileServer
);

router.get('/getAllFile', authorize(['USER']), getAllFile);
router.get('/getAllFilePublic', getAllFilePublic);
router.get('/getAllFilePublicServer', getAllFilePublicServer);
router.get('/updateFIle', authorize(['USER', 'ADMIN']), updateFile);

router.delete('/deleteFile/:id', authorize(['USER', 'ADMIN']), deleteFile);

export default router;
