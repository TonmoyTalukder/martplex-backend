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
exports.paymentController = void 0;
const responseHelper_1 = require("../../../helpers/responseHelper");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const pick_1 = __importDefault(require("../../../shared/pick"));
const payment_constant_1 = require("./payment.constant");
const payment_service_1 = require("./payment.service");
const getAllPayments = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, payment_constant_1.paymentFilterableFields);
    const options = (0, pick_1.default)(req.query, payment_constant_1.paymentFilterableOptions);
    const result = yield payment_service_1.paymentService.getAllPayments(filters, options);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Payment data fetched!',
        meta: result.meta,
        data: result.data,
    });
}));
const getPaymentByID = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.paymentService.getPaymentByID(req);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Payment by ID data fetched!',
        data: result,
    });
}));
const updatePaymentMethod = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId, paymentMethod } = req.body;
    const result = yield payment_service_1.paymentService.updatePaymentMethod(paymentId, paymentMethod);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Payment Method updated successfully.',
        data: result,
    });
}));
const deleteUnsuccessfulPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield payment_service_1.paymentService.deletePayment(id);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Unsuccessful payment deleted successfully!',
        data: result,
    });
}));
const deletePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield payment_service_1.paymentService.deletePayment(id);
    (0, responseHelper_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Payment deleted successfully!',
        data: result,
    });
}));
const initiatePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentId } = req.params;
        const { userId, deliveryAddress } = req.body;
        const result = yield payment_service_1.paymentService.initiatePayment(paymentId, userId, deliveryAddress);
        (0, responseHelper_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Payment initiated successfully!',
            data: result.paymentSession,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.paymentController = {
    getAllPayments,
    getPaymentByID,
    updatePaymentMethod,
    deleteUnsuccessfulPayment,
    deletePayment,
    initiatePayment,
};
