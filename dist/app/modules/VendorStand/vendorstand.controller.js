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
exports.vendorStandController = void 0;
const responseHelper_1 = require("../../../helpers/responseHelper");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const vendorstand_service_1 = require("./vendorstand.service");
const vendorstand_constant_1 = require("./vendorstand.constant");
const pick_1 = __importDefault(require("../../../shared/pick"));
const getAllVendorStands = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, vendorstand_constant_1.vendorStandFilterableFields);
    const options = (0, pick_1.default)(req.query, vendorstand_constant_1.vendorStandFilterableOptions);
    const result = yield vendorstand_service_1.vendorStandService.getAllVendorStands(filters, options);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Vendor Stand data fetched!',
        meta: result.meta,
        data: result.data,
    });
}));
const getVendorStandByID = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield vendorstand_service_1.vendorStandService.getVendorStandByID(id);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Vendor Stand by ID data fetched!',
        data: result,
    });
}));
const createVendorStand = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendorstand_service_1.vendorStandService.createVendorStand(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Vendor Stand created successfully.',
        data: result,
    });
}));
const updateVendorStand = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendorstand_service_1.vendorStandService.updateVendorStand(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Vendor Stand updated successfully.',
        data: result,
    });
}));
const blacklistVendorStand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { blacklist } = req.body;
    const result = yield vendorstand_service_1.vendorStandService.blacklistVendorStand(id, blacklist);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Vendor Stand blacklisted successfuly!',
        data: result,
    });
}));
const softDelete = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield vendorstand_service_1.vendorStandService.softDelete(id);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Vendor Stand deleted successfully!',
        data: result,
    });
}));
// Follow VendorStand //
const followVendorStand = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendorstand_service_1.vendorStandService.followVendorStand(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Vendor Stand Followed!',
        data: result,
    });
}));
const getVendorStandFollowers = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendorstand_service_1.vendorStandService.getVendorStandFollowers(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Vendor Stand Followers fetched!',
        data: result,
    });
}));
const getFollowedVendorStands = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendorstand_service_1.vendorStandService.getFollowedVendorStands(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Followed Vendor Stands fetched!',
        data: result,
    });
}));
exports.vendorStandController = {
    getAllVendorStands,
    getVendorStandByID,
    createVendorStand,
    updateVendorStand,
    blacklistVendorStand,
    softDelete,
    followVendorStand,
    getVendorStandFollowers,
    getFollowedVendorStands,
};
