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
exports.getInfoUser = exports.seedUser = exports.register = exports.login = void 0;
const jwt_1 = require("./../utils/jwt");
const user_1 = __importDefault(require("../models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const session_1 = __importDefault(require("../models/session"));
const user_2 = require("../data/user");
dotenv_1.default.config();
const EXP_REFRESH_TOKEN = process.env.HASH_ROUNDS
    ? Number(process.env.HASH_ROUNDS)
    : 12;
console.log({ EXP_REFRESH_TOKEN });
const generateTokenUser = (user) => {
    const userResponse = {
        _id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        schoolId: user.schoolId,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
    };
    return [(0, jwt_1.generateToken)(userResponse), (0, jwt_1.generateRefreshToken)(userResponse)];
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email }).exec();
        if (!user)
            throw new Error("Not Found Email");
        if (!(yield user.validatePassword(password)))
            throw new Error("incorrect password");
        const [accessToken, refreshToken] = generateTokenUser(user);
        yield (0, jwt_1.validateToken)(accessToken);
        const session = new session_1.default({
            idUser: user._id,
            refreshToken,
            expTime: new Date().setDate(new Date().getDate() + 10),
        });
        yield session.save();
        return res.json({
            accessToken,
            session,
        });
    }
    catch (error) {
        return res.status(400).json({ message: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, lastName, firstName, schoolId, password, dateOfBirth } = req.body;
        const user = new user_1.default({
            lastName,
            firstName,
            email,
            schoolId,
            dateOfBirth,
            passHash: password,
        });
        yield user.save();
        return res.json(user);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.register = register;
const seedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_1.default.remove();
        user_2.users.forEach((x) => __awaiter(void 0, void 0, void 0, function* () {
            const user = new user_1.default(x);
            yield user.save();
        }));
        return res.json(yield user_1.default.find());
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.seedUser = seedUser;
const getInfoUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req;
        return res.json(user.user);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.getInfoUser = getInfoUser;
