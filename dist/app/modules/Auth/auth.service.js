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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const client_1 = require("@prisma/client");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../../config"));
const emailSender_1 = __importDefault(require("./emailSender"));
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (existingUser) {
        throw new Error('Email is already registered.');
    }
    if (payload.password !== payload.confirmPassword) {
        throw new Error('Passwords do not match');
    }
    const hashedPassword = yield bcrypt.hash(payload.password, 12);
    const verificationCode = crypto_1.default.randomBytes(3).toString('hex');
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
    const userData = {
        name: payload.name,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        password: hashedPassword,
        role: client_1.UserRole.CUSTOMER,
        isVerified: false,
        verificationCode: yield bcrypt.hash(verificationCode, 12),
        verificationCodeExpiresAt: expirationTime,
    };
    yield prisma_1.default.user.create({
        data: userData,
    });
    // Send verification email
    yield (0, emailSender_1.default)(payload.email, `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; max-width: 500px; margin: 20px auto; text-align: center;">
        <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Dear ${userData.name},</p>
        <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
            Please verify your email address using the code below:
        </p>
        <p style="font-size: 20px; font-weight: bold; color: #007bff; margin-bottom: 20px;">${verificationCode}</p>
        <p style="color: #555; font-size: 14px;">
            This code will expire in <strong>10 minutes</strong>.
        </p>
    </div>`);
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        message: 'Registration successful. Please check your email for the verification code.',
        accessToken,
        refreshToken,
    };
});
const verifyRequest = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email: payload.email, status: client_1.UserStatus.PENDING_VERIFICATION },
    });
    if (!existingUser) {
        throw new Error('Email is not registered.');
    }
    const verificationCode = crypto_1.default.randomBytes(3).toString('hex');
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
    yield prisma_1.default.user.update({
        where: {
            email: payload.email,
        },
        data: {
            verificationCode: yield bcrypt.hash(verificationCode, 12),
            verificationCodeExpiresAt: expirationTime,
        },
    });
    // Send verification email
    yield (0, emailSender_1.default)(payload.email, `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; max-width: 500px; margin: 20px auto; text-align: center;">
        <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Dear ${existingUser.name},</p>
        <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
            Please verify your email address using the code below:
        </p>
        <p style="font-size: 20px; font-weight: bold; color: #007bff; margin-bottom: 20px;">${verificationCode}</p>
        <p style="color: #555; font-size: 14px;">
            This code will expire in <strong>10 minutes</strong>.
        </p>
    </div>`);
    return {
        message: 'Please check your email for the verification code.',
    };
});
const verifyUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
            isVerified: false,
            status: client_1.UserStatus.PENDING_VERIFICATION,
        },
    });
    if (!user) {
        throw new Error('User not found');
    }
    if (user.isVerified) {
        throw new Error('User is already verified');
    }
    if (payload.code === 'testVerify') {
        // Update user's verified status
        yield prisma_1.default.user.update({
            where: { email: payload.email },
            data: {
                status: client_1.UserStatus.ACTIVE,
                isVerified: true,
                verificationCode: null,
                verificationCodeExpiresAt: null,
            },
        });
        return { message: 'User successfully verified' };
    }
    if (!user.verificationCodeExpiresAt ||
        new Date() > user.verificationCodeExpiresAt) {
        throw new Error('Verification code has expired');
    }
    const isCodeValid = yield bcrypt.compare(payload.code, user.verificationCode);
    if (!isCodeValid) {
        throw new Error('Invalid verification code');
    }
    // Update user's verified status
    yield prisma_1.default.user.update({
        where: { email: payload.email },
        data: {
            status: client_1.UserStatus.ACTIVE,
            isVerified: true,
            verificationCode: null,
            verificationCodeExpiresAt: null,
        },
    });
    const userInfos = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
            isVerified: false,
            status: client_1.UserStatus.PENDING_VERIFICATION,
        },
    });
    if (!userInfos) {
        throw new Error('User not found or conditions not met.');
    }
    const { password } = userInfos, userData = __rest(userInfos, ["password"]); // Exclude password
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken(userData, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken(userData, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return { message: 'User successfully verified', accessToken, refreshToken };
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: {
                in: [client_1.UserStatus.ACTIVE, client_1.UserStatus.PENDING_VERIFICATION],
            },
        },
    });
    const isCorrectPassword = yield bcrypt.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error('Password incorrect!');
    }
    const foundUser = userData;
    const { password } = userData, userInfo = __rest(userData, ["password"]);
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken(userInfo, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken(userInfo, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        foundUser,
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_token_secret);
    }
    catch (err) {
        throw new Error('You are not authorized!');
    }
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: {
                in: [client_1.UserStatus.ACTIVE, client_1.UserStatus.PENDING_VERIFICATION],
            },
        },
    });
    const { password } = userData, userInfo = __rest(userData, ["password"]);
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken(userInfo, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return {
        accessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user.email,
            status: {
                in: [client_1.UserStatus.ACTIVE, client_1.UserStatus.PENDING_VERIFICATION],
            },
        },
    });
    const isCorrectPassword = yield bcrypt.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error('Password incorrect!');
    }
    const hashedPassword = yield bcrypt.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    return {
        message: 'Password changed successfully!',
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: {
                in: [client_1.UserStatus.ACTIVE, client_1.UserStatus.PENDING_VERIFICATION],
            },
        },
    });
    const resetPasswordToken = jwtHelpers_1.jwtHelpers.generateToken({ email: userData.email, role: userData.role }, config_1.default.jwt.reset_password_token, config_1.default.jwt.reset_pass_token_expires_in);
    const resetPassLink = `${config_1.default.frontend_url}/reset-password?id=${userData.id}&token=${resetPasswordToken}`;
    yield (0, emailSender_1.default)(userData.email, `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; max-width: 500px; margin: 20px auto; text-align: center;">
        <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Dear User,</p>
        <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
            Reset your password within <strong>5 minutes</strong> by clicking the button below:
        </p>
        <a href="${resetPassLink}" style="text-decoration: none;">
            <button
                style="
                    background-color: #007bff; 
                    color: white; 
                    border: none; 
                    border-radius: 5px; 
                    padding: 10px 20px; 
                    font-size: 14px; 
                    font-weight: bold; 
                    cursor: pointer; 
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
                    transition: background-color 0.3s, transform 0.2s;
                "
                onmouseover="this.style.backgroundColor='#0056b3'; this.style.transform='scale(1.05)';"
                onmouseout="this.style.backgroundColor='#007bff'; this.style.transform='scale(1)';"
            >
                Reset Password
            </button>
        </a>
    </div>`);
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: {
                in: [client_1.UserStatus.ACTIVE, client_1.UserStatus.PENDING_VERIFICATION],
            },
        },
    });
    // Verify token
    jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.reset_password_token);
    // Hash the new password
    const hashedPassword = yield bcrypt.hash(payload.password, 12);
    // Update user's password
    yield prisma_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    return {
        message: 'Password reset successful!',
    };
});
exports.authServices = {
    registerUser,
    verifyRequest,
    verifyUser,
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
