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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewReplyController = void 0;
const responseHelper_1 = require("../../../helpers/responseHelper");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const pick_1 = __importDefault(require("../../../shared/pick"));
const reviewReply_constant_1 = require("./reviewReply.constant");
const reviewReply_service_1 = require("./reviewReply.service");
const getAllReviewReplies = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, reviewReply_constant_1.reviewReplyFilterableFields);
    const options = (0, pick_1.default)(req.query, reviewReply_constant_1.reviewReplyFilterableOptions);
    const result = yield reviewReply_service_1.reviewReplyService.getAllReviewReplies(filters, options);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Review data fetched!',
        meta: result.meta,
        data: result.data,
    });
}));
const getReviewReplyByID = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewReply_service_1.reviewReplyService.getReviewReplyByID(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Review by ID data fetched!',
        data: result,
    });
}));
const createReview = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewReply_service_1.reviewReplyService.createReview(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Review created successfully.',
        data: result,
    });
}));
const createReply = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewReply_service_1.reviewReplyService.createReply(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Reply created successfully.',
        data: result,
    });
}));
const updateReview = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewReply_service_1.reviewReplyService.updateReview(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Review updated successfully.',
        data: result,
    });
}));
const updateReply = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewReply_service_1.reviewReplyService.updateReply(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Reply updated successfully.',
        data: result,
    });
}));
const deleteReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield reviewReply_service_1.reviewReplyService.deleteReview(id);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Review deleted successfully!',
        data: result,
    });
}));
const deleteReply = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield reviewReply_service_1.reviewReplyService.deleteReply(id);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Reply deleted successfully!',
        data: result,
    });
}));
exports.reviewReplyController = {
    getAllReviewReplies,
    getReviewReplyByID,
    createReview,
    createReply,
    updateReview,
    updateReply,
    deleteReview,
    deleteReply,
};
