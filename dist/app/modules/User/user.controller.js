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
exports.userController = void 0;
const user_service_1 = require("./user.service");
const responseHelper_1 = require("../../../helpers/responseHelper");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const createAdmin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.createAdmin(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Admin created successfully.',
        data: result,
    });
}));
const getAllFromDB = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const filters = pick(req.query, userFilterableFields);
    // const options = pick(req.query, userFilterableOptions);
    const result = yield user_service_1.userService.getAllFromDB();
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Users data fetched!',
        // meta: result.meta,
        data: result.data,
    });
}));
const changeProfileStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.userService.changeProfileStatus(id, req.body);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Profile status changed successfuly!',
        data: result,
    });
}));
const becomeVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.userService.becomeVendor(id);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Profile role changed successfuly!',
        data: result,
    });
}));
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield user_service_1.userService.getMyProfile(user);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'My profile data fetched!',
        data: result,
    });
}));
const getUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield user_service_1.userService.getUserProfile(id);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'User profile data fetched!',
        data: result,
    });
}));
const updateMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    console.log('Found User: ', user);
    const result = yield user_service_1.userService.updateMyProfile(user, req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'My profile updated!',
        data: result,
    });
}));
const blockUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { block } = req.body;
    const result = yield user_service_1.userService.blockUser(id, block);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'User blocked successfuly!',
        data: result,
    });
}));
const softDelete = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.userService.softDelete(id);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'User deleted successfully!',
        data: result,
    });
}));
exports.userController = {
    createAdmin,
    getAllFromDB,
    changeProfileStatus,
    becomeVendor,
    getMyProfile,
    getUserProfile,
    updateMyProfile,
    blockUser,
    softDelete,
};
