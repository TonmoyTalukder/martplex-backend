"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const payment_validation_1 = require("./payment.validation");
const payment_controller_1 = require("./payment.controller");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const aamarpay_controller_1 = require("../Aamarpay/aamarpay.controller");
const router = express_1.default.Router();
router.get('/:id', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(payment_validation_1.paymentValidation.getPaymentByIDSchema), payment_controller_1.paymentController.getPaymentByID);
router.get('/', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), payment_controller_1.paymentController.getAllPayments);
router.patch('/:id/update/payment-method', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(payment_validation_1.paymentValidation.updatePaymentMethodSchema), payment_controller_1.paymentController.updatePaymentMethod);
router.patch('/unsuccessful/:id/delete', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(payment_validation_1.paymentValidation.deleteUnsuccessfulPaymentSchema), payment_controller_1.paymentController.deleteUnsuccessfulPayment);
router.patch('/:id/delete', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(payment_validation_1.paymentValidation.deletePaymentSchema), payment_controller_1.paymentController.deletePayment);
// Route to initiate payment for a payment
router.post('/initiate-payment/:paymentId', (0, auth_1.default)(client_1.UserRole.CUSTOMER), (0, catchAsync_1.default)(payment_controller_1.paymentController.initiatePayment));
router.post('/confirmation', aamarpay_controller_1.aamarpayController.confirmationController);
exports.paymentRoutes = router;
