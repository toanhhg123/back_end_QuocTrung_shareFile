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
exports.getAllSchool = exports.seedSchool = void 0;
const School_1 = __importDefault(require("../models/School"));
const school_1 = require("../data/school");
const seedSchool = (req, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRequest = req;
        yield School_1.default.remove();
        const list = yield School_1.default.insertMany(school_1.schools);
        return response.json(list);
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
exports.seedSchool = seedSchool;
const getAllSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schools = yield School_1.default.find({});
        return res.json(schools);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.getAllSchool = getAllSchool;
