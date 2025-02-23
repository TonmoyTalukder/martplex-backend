"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const order_validation_1 = require("./order.validation");
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
router.get('/:id', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(order_validation_1.orderValidation.getOrderByIDSchema), order_controller_1.orderController.getOrderByID);
router.get('/', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), order_controller_1.orderController.getAllOrders);
router.post('/create-order', (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), 
// validateRequest(orderValidation.createOrderSchema),
order_controller_1.orderController.createOrder);
router.put('/:id/update-order', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(order_validation_1.orderValidation.updateOrderSchema), order_controller_1.orderController.updateOrder);
router.patch('/update-order-status', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), order_controller_1.orderController.updateOrderStatus);
router.post('/order-item/:id/update', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(order_validation_1.orderValidation.updateOrderItemSchema), order_controller_1.orderController.updateOrderItem);
router.patch('/:id/delete', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), 
// validateRequest(orderValidation.deleteOrderSchema),
order_controller_1.orderController.deleteOrder);
router.patch('/order-item/:id/delete', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), 
// validateRequest(orderValidation.deleteOrderItemSchema),
order_controller_1.orderController.deleteOrderItem);
exports.orderRoutes = router;
