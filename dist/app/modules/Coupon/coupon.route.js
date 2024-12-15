"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const coupon_validation_1 = require("./coupon.validation");
const coupon_controller_1 = require("./coupon.controller");
const router = express_1.default.Router();
router.get('/:id', (0, auth_1.default)(client_1.UserRole.VENDOR), (0, validateRequest_1.default)(coupon_validation_1.couponValidation.getCouponByIDSchema), coupon_controller_1.couponController.getCouponByID);
router.get('/', coupon_controller_1.couponController.getAllCoupons);
router.post('/create-coupon', (0, auth_1.default)(client_1.UserRole.VENDOR), (0, validateRequest_1.default)(coupon_validation_1.couponValidation.createCouponSchema), coupon_controller_1.couponController.createCoupon);
router.put('/:id/update-coupon', (0, auth_1.default)(client_1.UserRole.VENDOR), (0, validateRequest_1.default)(coupon_validation_1.couponValidation.updateCouponSchema), coupon_controller_1.couponController.updateCoupon);
router.patch('/:id/delete', (0, auth_1.default)(client_1.UserRole.VENDOR), (0, validateRequest_1.default)(coupon_validation_1.couponValidation.deleteCouponSchema), coupon_controller_1.couponController.deleteCoupon);
exports.couponRoutes = router;
