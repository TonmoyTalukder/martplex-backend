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
exports.reportVendorStandService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const getAllReportVendorStands = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield prisma_1.default.reportVendorStand.findMany({
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
    const total = yield prisma_1.default.reportVendorStand.count({
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
const getReportVendorStandByID = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const reportVendorStandInfo = yield prisma_1.default.reportVendorStand.findUniqueOrThrow({
        where: {
            id: req.body.id,
        },
        include: {
            vendorStand: true,
            user: true,
        },
    });
    return { reportVendorStandInfo };
});
const createReportVendorStand = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, userId, vendorStandId } = req.body;
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: userId,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    yield prisma_1.default.vendorStand.findUniqueOrThrow({
        where: {
            id: vendorStandId,
            status: client_1.VendorStandStatus.ACTIVE,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.default.reportVendorStand.create({
        data: {
            content,
            userId,
            vendorStandId,
        },
    });
    return result;
});
const updateReportVendorStand = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { reportId, content, userId, vendorStandId } = req.body;
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: userId,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    yield prisma_1.default.vendorStand.findUniqueOrThrow({
        where: {
            id: vendorStandId,
            status: client_1.VendorStandStatus.ACTIVE,
            isDeleted: false,
        },
    });
    const existingVendorStand = yield prisma_1.default.reportVendorStand.findUniqueOrThrow({
        where: { id: reportId },
    });
    const result = yield prisma_1.default.reportVendorStand.update({
        where: { id: existingVendorStand.id },
        data: { content },
    });
    return result;
});
const deleteReportVendorStand = (reportId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!reportId) {
        throw new Error('Report ID is required.');
    }
    yield prisma_1.default.reportVendorStand.delete({
        where: { id: reportId },
    });
    return { message: 'Report deleted successfully.' };
});
exports.reportVendorStandService = {
    getAllReportVendorStands,
    getReportVendorStandByID,
    createReportVendorStand,
    updateReportVendorStand,
    deleteReportVendorStand,
};
