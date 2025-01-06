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
exports.recentProductService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const recentproduct_constant_1 = require("./recentproduct.constant");
const getAllRecentProducts = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    // Filter conditions
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: recentproduct_constant_1.recentProductSearchableFields.map((field) => ({
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
    // Fetch the latest 10 recent products
    const recentProducts = yield prisma_1.default.recentProduct.findMany({
        where: whereConditions,
        orderBy: {
            viewedAt: 'desc',
        },
        take: 10, // Get only the latest 10
        include: {
            product: true,
        },
    });
    // Get the total count of recent products
    const total = yield prisma_1.default.recentProduct.count({
        where: whereConditions,
    });
    // If more than 10, delete older products
    if (total > 10) {
        const idsToDelete = yield prisma_1.default.recentProduct.findMany({
            where: whereConditions,
            orderBy: {
                viewedAt: 'asc',
            },
            skip: 10, // Skip the latest 10
            select: { id: true },
        });
        const deleteIds = idsToDelete.map((product) => product.id);
        yield prisma_1.default.recentProduct.deleteMany({
            where: {
                id: {
                    in: deleteIds,
                },
            },
        });
    }
    return {
        meta: {
            total,
        },
        data: recentProducts,
    };
});
const getRecentProductByID = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const productInfo = yield prisma_1.default.recentProduct.findUniqueOrThrow({
        where: {
            id: req.body.id,
            product: {
                vendorStand: {
                    status: client_1.VendorStandStatus.ACTIVE,
                    isDeleted: false,
                    owner: {
                        status: client_1.UserStatus.ACTIVE,
                        isDeleted: false,
                    },
                },
            },
        },
    });
    return { productInfo };
});
const createRecentProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId, viewedAt } = req.body;
    const existingRecentProduct = yield prisma_1.default.recentProduct.findFirst({
        where: {
            userId,
            productId,
        },
    });
    let result;
    if (existingRecentProduct !== null) {
        result = yield prisma_1.default.recentProduct.update({
            where: {
                id: existingRecentProduct.id,
            },
            data: {
                viewedAt,
            },
            include: {
                user: true,
                product: true,
            },
        });
    }
    else {
        result = yield prisma_1.default.recentProduct.create({
            data: {
                userId,
                productId,
                viewedAt,
            },
            include: {
                user: true,
                product: true,
            },
        });
    }
    return result;
});
const updateRecentProduct = (id, viewedAt) => __awaiter(void 0, void 0, void 0, function* () {
    const existingRecentProduct = yield prisma_1.default.recentProduct.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const productInfo = yield prisma_1.default.recentProduct.update({
        where: {
            id: existingRecentProduct.id,
        },
        data: {
            viewedAt,
        },
    });
    return { productInfo };
});
exports.recentProductService = {
    getAllRecentProducts,
    getRecentProductByID,
    createRecentProduct,
    updateRecentProduct,
};
