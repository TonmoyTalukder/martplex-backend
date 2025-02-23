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
exports.flashSaleService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const getAllFlashSales = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield prisma_1.default.flashSale.findMany({
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
            products: true,
        },
    });
    const total = yield prisma_1.default.flashSale.count({
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
const getFlashSaleByID = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const flashSaleInfo = yield prisma_1.default.flashSale.findUniqueOrThrow({
        where: {
            id: req.body.id,
        },
    });
    return { flashSaleInfo };
});
const createFlashSale = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, discount, startsAt, endsAt, productIds } = req.body;
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const flashSale = yield prisma.flashSale.create({
            data: {
                name,
                description,
                discount,
                startsAt,
                endsAt,
                isActive: true,
                products: {
                    connect: productIds.map((id) => ({ id })),
                },
            },
        });
        yield prisma.product.updateMany({
            where: {
                id: { in: productIds },
            },
            data: {
                flashSale: true,
            },
        });
        return flashSale;
    }));
    return result;
});
const updateFlashSale = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { flashSaleId, name, description, discount, startsAt, endsAt, isActive, } = req.body;
    const existingFlashSale = yield prisma_1.default.flashSale.findUniqueOrThrow({
        where: { id: flashSaleId },
    });
    const result = yield prisma_1.default.flashSale.update({
        where: { id: existingFlashSale.id },
        data: { name, description, discount, startsAt, endsAt, isActive },
    });
    if (!isActive) {
        // Set flashSale field to false for associated products
        yield prisma_1.default.product.updateMany({
            where: { flashSaleId },
            data: { flashSale: false },
        });
    }
    return result;
});
const updateFlashSaleStatus = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { flashSaleId, isActive } = req.body;
    // Update the flash sale status
    const flashSale = yield prisma_1.default.flashSale.update({
        where: { id: flashSaleId },
        data: { isActive },
    });
    if (!isActive) {
        // Set flashSale field to false for associated products
        yield prisma_1.default.product.updateMany({
            where: { flashSaleId },
            data: { flashSale: false },
        });
    }
    return flashSale;
});
const deleteFlashSale = (flashSaleId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!flashSaleId) {
        throw new Error('Flash Sale ID is required.');
    }
    yield prisma_1.default.flashSale.delete({
        where: { id: flashSaleId },
    });
    return { message: 'Flash Sale deleted successfully.' };
});
exports.flashSaleService = {
    getAllFlashSales,
    getFlashSaleByID,
    createFlashSale,
    updateFlashSale,
    updateFlashSaleStatus,
    deleteFlashSale,
};
