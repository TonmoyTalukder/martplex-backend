"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flashSaleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const flashSale_controller_1 = require("./flashSale.controller");
const router = express_1.default.Router();
router.get('/:id', 
// auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
// validateRequest(flashSaleValidation.getFlashSaleByIDSchema),
flashSale_controller_1.flashSaleController.getFlashSaleByID);
router.get('/', flashSale_controller_1.flashSaleController.getAllFlashSales);
router.post('/create', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), 
// validateRequest(flashSaleValidation.createFlashSaleSchema),
flashSale_controller_1.flashSaleController.createFlashSale);
router.put('/update', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), 
// validateRequest(flashSaleValidation.updateFlashSaleSchema),
flashSale_controller_1.flashSaleController.updateFlashSale);
router.put('/update-status', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), flashSale_controller_1.flashSaleController.updateFlashSaleStatus);
router.patch('/:id/delete', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), 
// validateRequest(flashSaleValidation.deleteFlashSaleSchema),
flashSale_controller_1.flashSaleController.deleteFlashSale);
exports.flashSaleRoutes = router;
