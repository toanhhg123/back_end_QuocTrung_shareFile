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
const validate_1 = require("../utils/validate");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const School_1 = __importDefault(require("./School"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const HASH_ROUNDS = process.env.HASH_ROUNDS
    ? Number(process.env.HASH_ROUNDS)
    : 12;
console.log({ HASH_ROUNDS });
const roles = ["ADMIN", "USER"];
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        require: [true, "Email address is required"],
        unique: [true, "Email is exist"],
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    passHash: { type: String, require: true },
    schoolId: { type: String, require: true },
    dateOfBirth: { type: Date, require: true },
    role: { type: String, enum: roles, default: "USER" },
}, {
    timestamps: true,
});
userSchema.pre("validate", { document: true }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.lastName)
            next(new Error("lastname is Empty"));
        if (!this.firstName)
            next(new Error("firstName is Empty"));
        if (!this.dateOfBirth)
            next(new Error("birth time is Empty"));
        if (!this.passHash)
            next(new Error("password is Empty"));
        //email
        if (!(0, validate_1.validateEmail)(this.email))
            next(new Error("The e-mail field cannot be empty."));
        if (yield User.findOne({ email: this.email }))
            next(new Error("Email is exist"));
        // password
        if (this.passHash.length < 6)
            next(new Error("Passwords are between 6 and 12 characters long"));
        if (!this.schoolId || !(yield School_1.default.findById(this.schoolId)))
            next(new Error("School not found"));
        if (!this.role || !roles.includes(this.role))
            next(new Error("Invalid role"));
        else
            next();
    });
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const thisObj = this;
        if (!this.isModified("passHash")) {
            return next();
        }
        try {
            console.log("save....");
            const salt = yield bcryptjs_1.default.genSalt(HASH_ROUNDS);
            thisObj.passHash = yield bcryptjs_1.default.hash(thisObj.passHash, salt);
            return next();
        }
        catch (e) {
            return next(e);
        }
    });
});
userSchema.pre("insertMany", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const thisObj = this;
        if (!this.isModified("passHash")) {
            return next();
        }
        try {
            console.log("save....");
            const salt = yield bcryptjs_1.default.genSalt(HASH_ROUNDS);
            thisObj.passHash = yield bcryptjs_1.default.hash(thisObj.passHash, salt);
            return next();
        }
        catch (e) {
            return next(e);
        }
    });
});
userSchema.methods.validatePassword = function (pass) {
    return __awaiter(this, void 0, void 0, function* () {
        const thisObj = this;
        return yield bcryptjs_1.default.compare(pass, thisObj.passHash);
    });
};
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
