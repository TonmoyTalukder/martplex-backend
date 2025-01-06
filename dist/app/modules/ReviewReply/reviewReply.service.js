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
exports.reviewReplyService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const getAllReviewReplies = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield prisma_1.default.review.findMany({
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
            user: true,
        },
    });
    const total = yield prisma_1.default.review.count({
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
const getReviewReplyByID = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewReplyInfo = yield prisma_1.default.review.findUniqueOrThrow({
        where: {
            id: req.body.id,
        },
        include: {
            reply: {
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });
    return { reviewReplyInfo };
});
const createReview = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, rating, userId, productId, vendorStandId, orderId } = req.body;
    const result = yield prisma_1.default.review.create({
        data: {
            content,
            rating,
            userId,
            productId,
            vendorStandId,
            orderId,
        },
    });
    return result;
});
const createReply = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, userId, reviewId } = req.body;
    yield prisma_1.default.review.findUniqueOrThrow({
        where: { id: reviewId },
    });
    const result = yield prisma_1.default.reply.create({
        data: {
            content,
            userId,
            reviewId,
        },
    });
    return result;
});
const updateReview = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId, content, rating } = req.body;
    const existingReview = yield prisma_1.default.review.findUniqueOrThrow({
        where: { id: reviewId },
    });
    const result = yield prisma_1.default.review.update({
        where: { id: existingReview.id },
        data: { content, rating },
    });
    return result;
});
const updateReply = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { replyId, content } = req.body;
    const existingReply = yield prisma_1.default.reply.findUniqueOrThrow({
        where: { id: replyId },
    });
    yield prisma_1.default.review.findUniqueOrThrow({
        where: { id: existingReply.reviewId },
    });
    const result = yield prisma_1.default.reply.update({
        where: { id: existingReply.id },
        data: { content },
    });
    return result;
});
const deleteReview = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!reviewId) {
        throw new Error('Review ID is required.');
    }
    yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.reply.deleteMany({
            where: { reviewId },
        });
        yield prisma.review.delete({
            where: { id: reviewId },
        });
    }));
    return { message: 'Review deleted successfully.' };
});
const deleteReply = (replyId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!replyId) {
        throw new Error('Reply ID is required.');
    }
    yield prisma_1.default.reply.delete({
        where: { id: replyId },
    });
    return { message: 'Reply deleted successfully.' };
});
exports.reviewReplyService = {
    getAllReviewReplies,
    getReviewReplyByID,
    createReview,
    createReply,
    updateReview,
    updateReply,
    deleteReview,
    deleteReply,
};
