"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.generateRefreshToken = exports.generateToken = void 0;
require("dotenv/config");
const jsonwebtoken_1 = require("jsonwebtoken");
const privateKey = process.env.JWT_PRIVATEKEY || 'No key';
console.log({ privateKey });
const generateToken = (payload) => {
    const signInOptions = {
        expiresIn: '1d',
    };
    return (0, jsonwebtoken_1.sign)(payload, privateKey, signInOptions);
};
exports.generateToken = generateToken;
const generateRefreshToken = (payload) => {
    const privateKey = process.env.JWT_PRIVATEKEY || 'No key';
    const signInOptions = {
        expiresIn: '10d',
    };
    return (0, jsonwebtoken_1.sign)(payload, privateKey, signInOptions);
};
exports.generateRefreshToken = generateRefreshToken;
function validateToken(token) {
    return new Promise((resolve, reject) => {
        const verifyOptions = {
            algorithms: ['RS256'],
        };
        try {
            const decode = (0, jsonwebtoken_1.verify)(token, privateKey);
            return resolve(decode);
        }
        catch (error) {
            console.log({ error });
            return reject(error);
        }
    });
}
exports.validateToken = validateToken;
