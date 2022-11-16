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
exports.GoogleDriveService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const googleapis_1 = require("googleapis");
dotenv_1.default.config();
const GOOGLE_CLOUD_CLIENT_ID = process.env.GOOGLE_CLOUD_CLIENT_ID;
const GOOGLE_CLOUD_CLIENT_SECRET = process.env
    .GOOGLE_CLOUD_CLIENT_SECRET;
const GOOGLE_CLOUD_REFREST_TOKEN = process.env
    .GOOGLE_CLOUD_REFREST_TOKEN;
const GOOGLE_CLOUD_REDIRECT_URL = process.env
    .GOOGLE_CLOUD_REDIRECT_URL;
const oauth2Client = new googleapis_1.google.auth.OAuth2(GOOGLE_CLOUD_CLIENT_ID, GOOGLE_CLOUD_CLIENT_SECRET, GOOGLE_CLOUD_REDIRECT_URL);
const drive = googleapis_1.google.drive({
    version: "v3",
    auth: oauth2Client,
});
oauth2Client.setCredentials({
    refresh_token: GOOGLE_CLOUD_REFREST_TOKEN,
});
class GoogleDriveService {
    constructor(clientId, clientSecret, redirectUri, refreshToken) {
        this.driveClient = this.createDriveClient(clientId, clientSecret, redirectUri, refreshToken);
    }
    createDriveClient(clientId, clientSecret, redirectUri, refreshToken) {
        const client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectUri);
        client.setCredentials({ refresh_token: refreshToken });
        return googleapis_1.google.drive({
            version: "v3",
            auth: client,
        });
    }
    createFolder(folderName) {
        return this.driveClient.files.create({
            fields: "id,name",
            requestBody: {
                name: folderName,
                mimeType: "application/vnd.google-apps.folder",
            },
        });
    }
    searchFolder(folderName) {
        return new Promise((resolve, reject) => {
            this.driveClient.files.list({
                q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
                fields: "files(id, name)",
            }, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res === null || res === void 0 ? void 0 : res.data.files);
            });
        });
    }
    saveFile(fileName, filePath, fileMimeType, folderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.driveClient.files.create({
                requestBody: {
                    name: fileName,
                    mimeType: fileMimeType,
                    parents: folderId ? [folderId] : [],
                },
                media: {
                    mimeType: fileMimeType,
                    body: fs_1.default.createReadStream(filePath),
                },
            });
            fs_1.default.unlinkSync(filePath);
            return res;
        });
    }
    getAllFile(folder = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const folders = (yield this.searchFolder(folder)) || [];
            if (!folder.length)
                throw new Error("not found folder");
            const res = yield this.driveClient.files.list({
                q: `'${folders[0].id}' in parents and trashed = false`,
            });
            return res;
        });
    }
    setFilePublic(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.driveClient.permissions.create({
                    fileId,
                    requestBody: {
                        role: "reader",
                        type: "anyone",
                    },
                });
                const getUrl = yield drive.files.get({
                    fileId,
                    fields: "webViewLink, webContentLink",
                });
                return getUrl;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    DeleteFile(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.driveClient.files.delete({
                    fileId,
                });
                return Promise.resolve();
            }
            catch (error) {
                console.error(error);
                return Promise.reject(error);
            }
        });
    }
}
exports.GoogleDriveService = GoogleDriveService;
const googleDriveService = new GoogleDriveService(GOOGLE_CLOUD_CLIENT_ID, GOOGLE_CLOUD_CLIENT_SECRET, GOOGLE_CLOUD_REDIRECT_URL, GOOGLE_CLOUD_REFREST_TOKEN);
exports.default = googleDriveService;
