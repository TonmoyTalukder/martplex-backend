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
exports.vendorStandService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const vendorstand_constant_1 = require("./vendorstand.constant");
const getAllVendorStands = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondition = [
        {
            isDeleted: false,
        },
    ];
    if (searchTerm) {
        andCondition.push({
            OR: vendorstand_constant_1.vendorStandSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.vendorStand.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : {
                createdAt: 'desc',
            },
        include: {
            owner: true,
            products: {
                include: {
                    category: true,
                    reviews: true,
                    vendorStand: true,
                },
            },
        },
    });
    const sanitizedResult = result.map((vendorStand) => {
        if (vendorStand.owner) {
            delete vendorStand.owner.password;
        }
        return vendorStand;
    });
    const total = yield prisma_1.default.vendorStand.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: sanitizedResult,
    };
});
const getVendorStandByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Vendor Stand ID: ', id);
    const vendorStandInfo = yield prisma_1.default.vendorStand.findUniqueOrThrow({
        where: {
            id,
            status: client_1.VendorStandStatus.ACTIVE,
            isDeleted: false,
            owner: {
                status: client_1.UserStatus.ACTIVE,
                isDeleted: false,
            },
        },
        include: {
            owner: true,
            products: {
                include: {
                    category: true,
                    reviews: true,
                    vendorStand: true,
                },
            },
        },
    });
    if (vendorStandInfo.owner) {
        delete vendorStandInfo.owner.password;
    }
    return { vendorStandInfo };
});
const createVendorStand = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let logo = undefined;
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        logo = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const { name, description, ownerId } = req.body;
    if (!name || !description || !ownerId) {
        throw new Error('Name, description, and ownerId are required fields.');
    }
    const result = yield prisma_1.default.vendorStand.create({
        data: {
            name,
            description,
            logo,
            ownerId,
        },
        include: {
            owner: true,
        },
    });
    return result;
});
const updateVendorStand = (req) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.vendorStand.findUniqueOrThrow({
        where: {
            id: req.body.id,
            isDeleted: false,
        },
    });
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.data.logo = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const payload = req.body.data;
    const vendorStandInfo = yield prisma_1.default.vendorStand.update({
        where: {
            id: req.body.id,
        },
        data: payload,
    });
    return { vendorStandInfo };
});
const blacklistVendorStand = (id, blacklist) => __awaiter(void 0, void 0, void 0, function* () {
    const existingVendorStand = yield prisma_1.default.vendorStand.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: existingVendorStand.ownerId,
            isDeleted: false,
        },
    });
    const blacklistedVendorStand = yield prisma_1.default.vendorStand.update({
        where: {
            id,
        },
        data: {
            status: blacklist
                ? client_1.VendorStandStatus.BLACKLISTED
                : client_1.VendorStandStatus.ACTIVE,
        },
    });
    return blacklistedVendorStand;
});
const softDelete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingVendorStand = yield prisma_1.default.vendorStand.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: existingVendorStand.ownerId,
            isDeleted: false,
        },
    });
    const softDeleteVendorStand = yield prisma_1.default.vendorStand.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
    return softDeleteVendorStand;
});
// Follow VendorStand //
const followVendorStand = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, vendorId } = req.body;
    const result = yield prisma_1.default.follow.create({
        data: {
            userId: userId,
            vendorId: vendorId,
        },
    });
    return result;
});
const getVendorStandFollowers = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const allFollowers = yield prisma_1.default.vendorStand.findUnique({
        where: {
            id,
        },
        include: { followers: { include: { user: true } } },
    });
    return { allFollowers };
});
const getFollowedVendorStands = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const allFollowers = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
        include: { follows: { include: { vendor: true } } },
    });
    return { allFollowers };
});
exports.vendorStandService = {
    getAllVendorStands,
    getVendorStandByID,
    createVendorStand,
    updateVendorStand,
    blacklistVendorStand,
    softDelete,
    followVendorStand,
    getVendorStandFollowers,
    getFollowedVendorStands,
};
