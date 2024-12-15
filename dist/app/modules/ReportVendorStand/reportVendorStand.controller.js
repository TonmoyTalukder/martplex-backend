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
exports.reportVendorStandController = void 0;
const responseHelper_1 = require("../../../helpers/responseHelper");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const pick_1 = __importDefault(require("../../../shared/pick"));
const reportVendorStand_constant_1 = require("./reportVendorStand.constant");
const reportVendorStand_service_1 = require("./reportVendorStand.service");
const getAllReportVendorStands = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, reportVendorStand_constant_1.reportVendorStandFilterableFields);
    const options = (0, pick_1.default)(req.query, reportVendorStand_constant_1.reportVendorStandFilterableOptions);
    const result = yield reportVendorStand_service_1.reportVendorStandService.getAllReportVendorStands(filters, options);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Report data fetched!',
        meta: result.meta,
        data: result.data,
    });
}));
const getReportVendorStandByID = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reportVendorStand_service_1.reportVendorStandService.getReportVendorStandByID(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Report by ID data fetched!',
        data: result,
    });
}));
const createReportVendorStand = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reportVendorStand_service_1.reportVendorStandService.createReportVendorStand(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Report created successfully.',
        data: result,
    });
}));
const updateReportVendorStand = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reportVendorStand_service_1.reportVendorStandService.updateReportVendorStand(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Report updated successfully.',
        data: result,
    });
}));
const deleteReportVendorStand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield reportVendorStand_service_1.reportVendorStandService.deleteReportVendorStand(id);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Report deleted successfully!',
        data: result,
    });
}));
exports.reportVendorStandController = {
    getAllReportVendorStands,
    getReportVendorStandByID,
    createReportVendorStand,
    updateReportVendorStand,
    deleteReportVendorStand,
};
