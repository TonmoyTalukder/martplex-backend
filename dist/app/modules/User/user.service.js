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
exports.userService = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../config"));
const createAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, phoneNumber, password } = req.body;
    if (!email || !name || !phoneNumber || !password) {
        throw new Error('Missing required fields: email, name, phoneNumber, or password.');
    }
    // // Find the user with email and isDeleted=false
    // const user = await prisma.user.findFirst({
    //   where: {
    //     email,
    //     isDeleted: false,
    //   },
    // });
    // if (!user) {
    //   throw new Error('User not found or marked as deleted.');
    // }
    // Hash the password
    const hashedPassword = yield bcrypt.hash(password, 12);
    // Upsert the user to become an admin
    const result = yield prisma_1.default.user.upsert({
        where: { email },
        update: {
            role: client_1.UserRole.ADMIN,
        },
        create: {
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            role: client_1.UserRole.ADMIN,
            status: client_1.UserStatus.ACTIVE,
            isVerified: true,
            verificationCode: null,
            verificationCodeExpiresAt: null,
        },
    });
    return result;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // const { limit, page, skip, sortBy, sortOrder } =
    //   paginationHelper.calculatePagination(options);
    // const { searchTerm, ...filterData } = params;
    // const andCondition: Prisma.UserWhereInput[] = [];
    // if (searchTerm) {
    //   andCondition.push({
    //     OR: userSearchableFields.map((field) => ({
    //       [field]: {
    //         contains: searchTerm,
    //         mode: 'insensitive',
    //       },
    //     })),
    //   });
    // }
    // if (Object.keys(filterData).length > 0) {
    //   andCondition.push({
    //     AND: Object.keys(filterData).map((key) => ({
    //       [key]: {
    //         equals: (filterData as any)[key],
    //       },
    //     })),
    //   });
    // }
    // const whereConditions: Prisma.UserWhereInput =
    //   andCondition.length > 0 ? { AND: andCondition } : {};
    // const role =
    //   whereConditions.role && typeof whereConditions.role === 'string'
    //     ? whereConditions.role
    //     : undefined;
    const result = yield prisma_1.default.user.findMany();
    // const total = await prisma.user.count({
    //   where: whereConditions,
    // });
    // {
    //   where: whereConditions,
    //   skip,
    //   take: limit,
    //   orderBy:
    //     sortBy && sortOrder
    //       ? {
    //           [sortBy]: sortOrder,
    //         }
    //       : {
    //           createdAt: 'desc',
    //         },
    // }
    return {
        data: result,
    };
});
const changeProfileStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const updateUserStatus = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: status,
    });
    return updateUserStatus;
});
const becomeVendor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const updatedUser = yield prisma_1.default.user.update({
        where: {
            id, // The user ID
        },
        data: {
            role: user.role === client_1.UserRole.CUSTOMER ? client_1.UserRole.VENDOR : client_1.UserRole.CUSTOMER,
        },
    });
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken(updatedUser, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return {
        result: {
            updatedUser,
            accessToken,
        },
    };
});
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
            isDeleted: false,
        },
    });
    return { userInfo };
});
const getUserProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
            status: client_1.UserStatus.ACTIVE,
            isDeleted: false,
        },
    });
    const { password } = userInfo, userData = __rest(userInfo, ["password"]);
    return { userData };
});
const updateMyProfile = (user, req) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: {
                in: [client_1.UserStatus.ACTIVE, client_1.UserStatus.PENDING_VERIFICATION],
            },
        },
    });
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const payload = req.body;
    const profileInfo = yield prisma_1.default.user.update({
        where: {
            email: userInfo.email,
        },
        data: payload,
    });
    return { profileInfo };
});
const blockUser = (id, block) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const blockedUser = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            status: block ? client_1.UserStatus.BLOCKED : client_1.UserStatus.ACTIVE,
        },
    });
    return blockedUser;
});
const softDelete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const softDeleteUser = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
            status: client_1.UserStatus.DELETED,
        },
    });
    return softDeleteUser;
});
exports.userService = {
    createAdmin,
    getAllFromDB,
    changeProfileStatus,
    becomeVendor,
    getMyProfile,
    getUserProfile,
    updateMyProfile,
    blockUser,
    softDelete,
};
