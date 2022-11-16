import { Router } from 'express';
import multer from 'multer';
import { upload } from '../config/multer';
import {
  delefile,
  uploadFile,
  getAllFile,
  getAllFilePublic,
  uploadFileServer,
} from '../controllers/fileController';
import { authorize } from '../middlewares/authMiddleware';
const router = Router();

router.post('/upload', authorize(['USER']), upload.single('file'), uploadFile);
router.post('/uploadServer', upload.single('file'), uploadFileServer);

router.get('/getAllFile', authorize(['USER']), getAllFile);
router.get('/getAllFilePublic', getAllFilePublic);

router.delete('/delete/:fileId', delefile);

export default router;
