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
exports.recentProductController = void 0;
const responseHelper_1 = require("../../../helpers/responseHelper");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const pick_1 = __importDefault(require("../../../shared/pick"));
const recentproduct_constant_1 = require("./recentproduct.constant");
const recentproduct_service_1 = require("./recentproduct.service");
const getAllRecentProducts = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, recentproduct_constant_1.recentProductFilterableFields);
    const options = (0, pick_1.default)(req.query, recentproduct_constant_1.recentProductFilterableOptions);
    const result = yield recentproduct_service_1.recentProductService.getAllRecentProducts(filters, options);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Recent Product data fetched!',
        data: result.data,
    });
}));
const getRecentProductByID = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield recentproduct_service_1.recentProductService.getRecentProductByID(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Recent Product by ID data fetched!',
        data: result,
    });
}));
const createRecentProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield recentproduct_service_1.recentProductService.createRecentProduct(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Recent Product created successfully.',
        data: result,
    });
}));
const updateRecentProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, viewedAt } = req.body;
    const result = yield recentproduct_service_1.recentProductService.updateRecentProduct(id, viewedAt);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Recent Product updated successfully.',
        data: result,
    });
}));
exports.recentProductController = {
    getAllRecentProducts,
    getRecentProductByID,
    createRecentProduct,
    updateRecentProduct,
};
