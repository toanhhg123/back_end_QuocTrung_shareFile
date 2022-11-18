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
exports.seedSpecialize = exports.seedFolder = void 0;
const file_1 = __importDefault(require("./utils/file"));
const specialized_1 = __importDefault(require("./models/specialized"));
const seedFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicFolder = yield file_1.default.createFolder('PublicFiles');
        return res.json(publicFolder);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.seedFolder = seedFolder;
const seedSpecialize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield specialized_1.default.remove();
        const data = yield specialized_1.default.insertMany(chuyennganh);
        return res.json(data);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.seedSpecialize = seedSpecialize;
const chuyennganh = [
    {
        name: 'Công nghệ sinh học',
    },
    {
        name: 'Công nghệ chế tạo máy',
    },
    {
        name: 'An toàn thông tin',
    },
    {
        name: 'Quản trị kinh doanh thực phẩm',
    },
    {
        name: 'Công nghệ kỹ thuật điện - điện tử',
    },
    {
        name: 'Công nghệ kỹ thuật cơ điện tử',
    },
    {
        name: 'Quản trị khách sạn',
    },
    {
        name: 'Ngôn ngữ Anh',
    },
    {
        name: 'Ngôn ngữ Trung Quốc',
    },
    {
        name: 'Kinh tế chính trị',
    },
];
