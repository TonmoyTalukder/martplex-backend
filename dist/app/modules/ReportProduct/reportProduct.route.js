"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const reportProduct_validation_1 = require("./reportProduct.validation");
const reportProduct_controller_1 = require("./reportProduct.controller");
const router = express_1.default.Router();
router.get('/:id', (0, auth_1.default)(client_1.UserRole.VENDOR), (0, validateRequest_1.default)(reportProduct_validation_1.reportProductValidation.getReportProductByIDSchema), reportProduct_controller_1.reportProductController.getReportProductByID);
router.get('/', reportProduct_controller_1.reportProductController.getAllReportProducts);
router.post('/create', (0, auth_1.default)(client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(reportProduct_validation_1.reportProductValidation.createReportProductSchema), reportProduct_controller_1.reportProductController.createReportProduct);
router.put('/:id/update', (0, auth_1.default)(client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(reportProduct_validation_1.reportProductValidation.updateReportProductSchema), reportProduct_controller_1.reportProductController.updateReportProduct);
router.patch('/:id/delete', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(reportProduct_validation_1.reportProductValidation.deleteReportProductSchema), reportProduct_controller_1.reportProductController.deleteReportProduct);
exports.reportProductRoutes = router;
