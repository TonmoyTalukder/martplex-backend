"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recentProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const recentproduct_validation_1 = require("./recentproduct.validation");
const recentproduct_controller_1 = require("./recentproduct.controller");
const router = express_1.default.Router();
router.get('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(recentproduct_validation_1.recentProductValidation.getRecentProductByIDSchema), recentproduct_controller_1.recentProductController.getRecentProductByID);
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), recentproduct_controller_1.recentProductController.getAllRecentProducts);
router.post('/create-recent-product', 
// auth(
//   UserRole.ADMIN,
//   UserRole.SUPER_ADMIN,
//   UserRole.VENDOR,
//   UserRole.CUSTOMER,
// ),
// validateRequest(recentProductValidation.createRecentProductSchema),
recentproduct_controller_1.recentProductController.createRecentProduct);
router.patch('/:id/update-recent-product', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(recentproduct_validation_1.recentProductValidation.updateRecentProductSchema), recentproduct_controller_1.recentProductController.updateRecentProduct);
exports.recentProductRoutes = router;
