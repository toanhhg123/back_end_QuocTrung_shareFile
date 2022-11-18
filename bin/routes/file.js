"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../config/multer");
const fileController_1 = require("../controllers/fileController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/upload', (0, authMiddleware_1.authorize)(['USER']), multer_1.upload.single('file'), fileController_1.uploadFile);
router.post('/uploadServer', (0, authMiddleware_1.authorize)(['USER']), multer_1.upload.single('file'), fileController_1.uploadFileServer);
router.get('/getAllFile', (0, authMiddleware_1.authorize)(['USER']), fileController_1.getAllFile);
router.get('/getAllFilePublic', fileController_1.getAllFilePublic);
router.get('/getAllFilePublicServer', fileController_1.getAllFilePublicServer);
router.get('/updateFIle', (0, authMiddleware_1.authorize)(['USER', 'ADMIN']), fileController_1.updateFile);
router.delete('/deleteFile/:id', (0, authMiddleware_1.authorize)(['USER', 'ADMIN']), fileController_1.deleteFile);
exports.default = router;
