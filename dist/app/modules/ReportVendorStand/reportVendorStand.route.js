"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportVendorStandRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const reportVendorStand_validation_1 = require("./reportVendorStand.validation");
const reportVendorStand_controller_1 = require("./reportVendorStand.controller");
const router = express_1.default.Router();
router.get('/:id', (0, auth_1.default)(client_1.UserRole.VENDOR), (0, validateRequest_1.default)(reportVendorStand_validation_1.reportVendorStandValidation.getReportVendorStandByIDSchema), reportVendorStand_controller_1.reportVendorStandController.getReportVendorStandByID);
router.get('/', reportVendorStand_controller_1.reportVendorStandController.getAllReportVendorStands);
router.post('/create', (0, auth_1.default)(client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(reportVendorStand_validation_1.reportVendorStandValidation.createReportVendorStandSchema), reportVendorStand_controller_1.reportVendorStandController.createReportVendorStand);
router.put('/:id/update', (0, auth_1.default)(client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(reportVendorStand_validation_1.reportVendorStandValidation.updateReportVendorStandSchema), reportVendorStand_controller_1.reportVendorStandController.updateReportVendorStand);
router.patch('/:id/delete', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(reportVendorStand_validation_1.reportVendorStandValidation.deleteReportVendorStandSchema), reportVendorStand_controller_1.reportVendorStandController.deleteReportVendorStand);
exports.reportVendorStandRoutes = router;
