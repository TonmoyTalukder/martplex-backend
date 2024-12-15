"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../app/errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const generateToken = (payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        algorithm: 'HS256',
        expiresIn,
    });
    return token;
};
const verifyToken = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (err) {
        if (err) {
            // console.log(err);
            // console.error('JWT verification error:', err.message);
            // return;
            if (err.name === 'TokenExpiredError') {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Token has expired.');
            }
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Invalid token.');
        }
    }
};
exports.jwtHelpers = {
    generateToken,
    verifyToken,
};
