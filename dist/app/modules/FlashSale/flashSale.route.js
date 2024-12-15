"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flashSaleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const flashSale_validation_1 = require("./flashSale.validation");
const flashSale_controller_1 = require("./flashSale.controller");
const router = express_1.default.Router();
router.get('/:id', (0, auth_1.default)(client_1.UserRole.VENDOR), (0, validateRequest_1.default)(flashSale_validation_1.flashSaleValidation.getFlashSaleByIDSchema), flashSale_controller_1.flashSaleController.getFlashSaleByID);
router.get('/', flashSale_controller_1.flashSaleController.getAllFlashSales);
router.post('/create', (0, auth_1.default)(client_1.UserRole.VENDOR), (0, validateRequest_1.default)(flashSale_validation_1.flashSaleValidation.createFlashSaleSchema), flashSale_controller_1.flashSaleController.createFlashSale);
router.put('/:id/update', (0, auth_1.default)(client_1.UserRole.VENDOR), (0, validateRequest_1.default)(flashSale_validation_1.flashSaleValidation.updateFlashSaleSchema), flashSale_controller_1.flashSaleController.updateFlashSale);
router.patch('/:id/delete', (0, auth_1.default)(client_1.UserRole.VENDOR), (0, validateRequest_1.default)(flashSale_validation_1.flashSaleValidation.deleteFlashSaleSchema), flashSale_controller_1.flashSaleController.deleteFlashSale);
exports.flashSaleRoutes = router;
