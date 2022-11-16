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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const jwt_1 = require("../utils/jwt");
const authorize = (roles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let jwt = req.headers.authorization;
        // verify request has token
        if (!jwt) {
            return res.status(401).json({ message: "Invalid token " });
        }
        // remove Bearer if using Bearer Authorization mechanism
        if (jwt.toLowerCase().startsWith("bearer")) {
            jwt = jwt.slice("bearer".length).trim();
        }
        // verify token hasn't expired yet
        const decodedToken = yield (0, jwt_1.validateToken)(jwt);
        if (!roles.some((x) => x === decodedToken.role))
            return res.status(403).json({ message: "forbibden" });
        req.user = decodedToken;
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ message: "Expired token" });
            return;
        }
        res.status(500).json({ message: "Failed to authenticate user" });
    }
});
exports.authorize = authorize;
