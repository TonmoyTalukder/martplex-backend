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
exports.reportProductService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const getAllReportProducts = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondition = [];
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
    const result = yield prisma_1.default.reportProduct.findMany({
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
    });
    const total = yield prisma_1.default.reportProduct.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getReportProductByID = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const reportProductInfo = yield prisma_1.default.reportProduct.findUniqueOrThrow({
        where: {
            id: req.body.id,
        },
        include: {
            product: true,
            user: true,
        },
    });
    return { reportProductInfo };
});
const createReportProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, userId, productId } = req.body;
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: userId,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const existingProduct = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id: productId,
            isDeleted: false,
        },
    });
    yield prisma_1.default.vendorStand.findUniqueOrThrow({
        where: {
            id: existingProduct.vendorStandId,
            status: client_1.VendorStandStatus.ACTIVE,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.default.reportProduct.create({
        data: {
            content,
            userId,
            productId,
        },
    });
    return result;
});
const updateReportProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { reportId, content, userId, productId } = req.body;
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: userId,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const existingProduct = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id: productId,
            isDeleted: false,
        },
    });
    yield prisma_1.default.vendorStand.findUniqueOrThrow({
        where: {
            id: existingProduct.vendorStandId,
            status: client_1.VendorStandStatus.ACTIVE,
            isDeleted: false,
        },
    });
    const existingReport = yield prisma_1.default.reportProduct.findUniqueOrThrow({
        where: { id: reportId },
    });
    const result = yield prisma_1.default.reportProduct.update({
        where: { id: existingReport.id },
        data: { content },
    });
    return result;
});
const deleteReportProduct = (reportId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!reportId) {
        throw new Error('Report ID is required.');
    }
    yield prisma_1.default.reportProduct.delete({
        where: { id: reportId },
    });
    return { message: 'Report deleted successfully.' };
});
exports.reportProductService = {
    getAllReportProducts,
    getReportProductByID,
    createReportProduct,
    updateReportProduct,
    deleteReportProduct,
};
