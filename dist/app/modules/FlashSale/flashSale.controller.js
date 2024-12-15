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
exports.flashSaleController = void 0;
const responseHelper_1 = require("../../../helpers/responseHelper");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const pick_1 = __importDefault(require("../../../shared/pick"));
const flashSale_service_1 = require("./flashSale.service");
const flashSale_constant_1 = require("./flashSale.constant");
const getAllFlashSales = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, flashSale_constant_1.flashSaleFilterableFields);
    const options = (0, pick_1.default)(req.query, flashSale_constant_1.flashSaleFilterableOptions);
    const result = yield flashSale_service_1.flashSaleService.getAllFlashSales(filters, options);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Flash sale data fetched!',
        meta: result.meta,
        data: result.data,
    });
}));
const getFlashSaleByID = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield flashSale_service_1.flashSaleService.getFlashSaleByID(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Flash sale by ID data fetched!',
        data: result,
    });
}));
const createFlashSale = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield flashSale_service_1.flashSaleService.createFlashSale(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Flash sale created successfully.',
        data: result,
    });
}));
const updateFlashSale = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield flashSale_service_1.flashSaleService.updateFlashSale(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Flash sale updated successfully.',
        data: result,
    });
}));
const deleteFlashSale = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield flashSale_service_1.flashSaleService.deleteFlashSale(id);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Flash sale deleted successfully!',
        data: result,
    });
}));
exports.flashSaleController = {
    getAllFlashSales,
    getFlashSaleByID,
    createFlashSale,
    updateFlashSale,
    deleteFlashSale,
};
