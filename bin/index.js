"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mogodb_1 = __importDefault(require("./connect/mogodb"));
const school_1 = __importDefault(require("./routes/school"));
const user_1 = __importDefault(require("./routes/user"));
const subject_1 = __importDefault(require("./routes/subject"));
const seedFolders_1 = require("./seedFolders");
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const file_1 = __importDefault(require("./routes/file"));
const specialized_1 = __importDefault(require("./routes/specialized"));
dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); /* NEW */
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/files', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
const port = process.env.PORT;
(0, mogodb_1.default)();
// connect().then(() => {
//   fs.readdir('src/data/files', (err, files) => {
//     // files.forEach(async (file) => {
//     //   const fileNew = await fileSchema.create({
//     //     name: file.toString(),
//     //     subjects: '6375ca86c74e521bf53547dc',
//     //     fileId: file.toString(),
//     //     type: file.split('.').pop(),
//     //     userId: '636483cfe6bb227603f2512d',
//     //     isAcctive: true,
//     //   });
//     //   console.log(fileNew);
//     //   process.exit();
//     // });
//   });
// });
app.use('/auth', user_1.default);
app.use('/school', school_1.default);
app.use('/file', file_1.default);
app.use('/specialized', specialized_1.default);
app.use('/subject', subject_1.default);
app.get('/seedFolder', seedFolders_1.seedSpecialize);
app.listen(port, () => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
