"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const cart_validation_1 = require("./cart.validation");
const cart_controller_1 = require("./cart.controller");
const router = express_1.default.Router();
router.get('/:id', (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), cart_controller_1.cartController.getCartByID);
router.post('/create-cart', (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), cart_controller_1.cartController.createCart);
router.post('/:id/update-cart', (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(cart_validation_1.cartValidation.updateCartSchema), cart_controller_1.cartController.updateCart);
router.put('/cart-item/:id/update', (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), 
// validateRequest(cartValidation.updateCartItemSchema),
cart_controller_1.cartController.updateCartItem);
router.patch('/:id/delete', (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(cart_validation_1.cartValidation.deleteCartSchema), cart_controller_1.cartController.deleteCart);
router.patch('/cart-item/:id/delete', (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), 
// validateRequest(cartValidation.deleteCartItemSchema),
cart_controller_1.cartController.deleteCartItem);
exports.cartRoutes = router;
