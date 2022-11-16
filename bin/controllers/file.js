"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileServer = exports.getAllFilePublic = exports.getAllFile = exports.delefile = exports.uploadFile = void 0;
const file_1 = __importDefault(require("../utils/file"));
const file_2 = __importDefault(require("../models/file"));
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        console.log({ user });
        if (!user)
            throw new Error("not found user");
        const file = req.file;
        if (!file)
            throw new Error("Not found file in request");
        console.log({ file });
        const folder = (yield file_1.default.searchFolder("Files")) || [];
        console.log({ folder });
        if (!folder.length)
            throw new Error("Not found folder");
        const fileSave = yield file_1.default.saveFile(file.filename, file.path, file.mimetype, folder[0].id || undefined);
        let filePublic = null;
        if (fileSave.data.id)
            filePublic = yield file_1.default.setFilePublic(fileSave.data.id);
        if (!filePublic)
            throw new Error("not set public file");
        const fileUpload = new file_2.default({
            name: file.filename,
            userId: user._id,
            linkDriver: filePublic.data.webViewLink,
            type: file.mimetype,
            isAcctive: true,
            fileId: fileSave.data.id,
        });
        yield fileUpload.save();
        return res.json(fileUpload);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.uploadFile = uploadFile;
const delefile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileId } = req.params;
        yield file_1.default.DeleteFile(fileId);
        const fileRemove = yield file_2.default.remove({ fileId });
        return res.json(fileRemove);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.delefile = delefile;
const getAllFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        console.log(user);
        const files = yield file_2.default.find({ userId: user === null || user === void 0 ? void 0 : user._id });
        return res.json(files);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.getAllFile = getAllFile;
const getAllFilePublic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield file_2.default.find({});
        return res.json(files);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.getAllFilePublic = getAllFilePublic;
const uploadFileServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        const fileBody = req.body;
        if (!file)
            throw new Error("not found file create");
        const { originalname } = file;
        fileBody.type = originalname.split(".")[-1];
        const fileNew = file_2.default.create({});
        return res.json(req.file);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.uploadFileServer = uploadFileServer;
