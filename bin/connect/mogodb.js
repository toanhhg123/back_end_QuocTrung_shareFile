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
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const password = process.env.PASSWORD;
const connectString = `mongodb+srv://ShareFile:${password}@sharefile.5zwp06t.mongodb.net/?retryWrites=true&w=majority`;
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield mongoose_1.default.connect('mongodb+srv://toanhhg123:112233Aa@sharefiles.4kuwq9j.mongodb.net/?retryWrites=true&w=majority');
        console.log('Connected successfully');
    }
    catch (error) {
        console.log({ errorConnet: error });
    }
});
exports.default = connect;
