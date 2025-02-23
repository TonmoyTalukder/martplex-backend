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
exports.couponService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const getAllCoupons = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield prisma_1.default.coupon.findMany({
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
    const total = yield prisma_1.default.coupon.count({
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
const getCouponByID = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const couponInfo = yield prisma_1.default.coupon.findUniqueOrThrow({
        where: {
            id: req.body.id,
        },
        include: {
            vendorStand: true,
        },
    });
    return { couponInfo };
});
const createCoupon = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, discount, expiresAt, vendorStandId } = req.body;
    console.log(req.body);
    const result = yield prisma_1.default.coupon.create({
        data: {
            code,
            discount,
            expiresAt: new Date(expiresAt),
            vendorStandId,
            isActive: true,
        },
    });
    return result;
});
const updateCoupon = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { couponId, code, discount, expiresAt, isActive } = req.body;
    console.log('req.body: ', req.body);
    const existingCoupon = yield prisma_1.default.coupon.findUniqueOrThrow({
        where: { id: couponId },
    });
    console.log(existingCoupon);
    const result = yield prisma_1.default.coupon.update({
        where: { id: existingCoupon.id },
        data: { code, discount, expiresAt, isActive },
    });
    console.log(result);
    return result;
});
const deleteCoupon = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!couponId) {
        throw new Error('Coupon ID is required.');
    }
    yield prisma_1.default.coupon.delete({
        where: { id: couponId },
    });
    return { message: 'Coupon deleted successfully.' };
});
exports.couponService = {
    getAllCoupons,
    getCouponByID,
    createCoupon,
    updateCoupon,
    deleteCoupon,
};
