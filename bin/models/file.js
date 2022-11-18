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
const mongoose_1 = require("mongoose");
const typeFiles_1 = __importDefault(require("./typeFiles"));
const fs_1 = __importDefault(require("fs"));
const subjects_1 = __importDefault(require("./subjects"));
const fileSchema = new mongoose_1.Schema({
    name: { type: String, require: [true, 'file name is require'] },
    userId: { type: String, require: true },
    linkDriver: { type: String, require: true },
    type: { type: String, require: true },
    isAcctive: { type: Boolean, require: true },
    fileId: { type: String, require: true },
    desc: { type: String, require: false, default: '' },
    subjects: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Subject' },
}, {
    timestamps: true,
});
fileSchema.pre('validate', { document: true }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!this.name && this.name.length < 10) {
                next(new Error('Invalid file name'));
                fs_1.default.unlinkSync('src/uploads/' + this.fileId);
            }
            else if (!(yield subjects_1.default.findOne({ name: this.subjects }))) {
                fs_1.default.unlinkSync('src/uploads/' + this.fileId);
                next(new Error('not found subjects'));
            }
            else
                next();
        }
        catch (error) {
            fs_1.default.unlinkSync('src/uploads/' + this.fileId);
            next(new Error(error.message));
        }
    });
});
fileSchema.pre('save', { document: true }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield typeFiles_1.default.findOne({ name: this.type }))) {
            yield typeFiles_1.default.create({ name: this.type });
        }
    });
});
fileSchema.pre('insertMany', { document: true }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield typeFiles_1.default.findOne({ name: this.type }))) {
            yield typeFiles_1.default.create({ name: this.type });
        }
    });
});
fileSchema.pre('remove', { document: true }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        fs_1.default.unlinkSync('src/uploads/' + this.fileId);
    });
});
const file = (0, mongoose_1.model)('File', fileSchema);
exports.default = file;
