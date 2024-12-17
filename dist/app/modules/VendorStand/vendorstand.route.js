"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorStandRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpers/fileUploader");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const vendorstand_controller_1 = require("./vendorstand.controller");
const vendorstand_validation_1 = require("./vendorstand.validation");
const router = express_1.default.Router();
router.get('/follow-vendor-stand', (0, validateRequest_1.default)(vendorstand_validation_1.vendorStandValidation.followVendorStandSchema), vendorstand_controller_1.vendorStandController.followVendorStand);
router.get('/vendor-stand/followers', (0, validateRequest_1.default)(vendorstand_validation_1.vendorStandValidation.getVendorStandFollowersSchema), vendorstand_controller_1.vendorStandController.getVendorStandFollowers);
router.get('/vendor-stand/followed', (0, validateRequest_1.default)(vendorstand_validation_1.vendorStandValidation.getFollowedVendorStandsSchema), vendorstand_controller_1.vendorStandController.getFollowedVendorStands);
router.get('/:id', (0, validateRequest_1.default)(vendorstand_validation_1.vendorStandValidation.getVendorStandByIDSchema), vendorstand_controller_1.vendorStandController.getVendorStandByID);
router.get('/', vendorstand_controller_1.vendorStandController.getAllVendorStands);
router.post('/create-vendor-stand', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.VENDOR), fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = vendorstand_validation_1.vendorStandValidation.createVendorStandSchema.parse(JSON.parse(req.body.data));
    return vendorstand_controller_1.vendorStandController.createVendorStand(req, res, next);
});
router.patch('/:id/update-vendor-stand', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.SUPER_ADMIN), fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return vendorstand_controller_1.vendorStandController.updateVendorStand(req, res, next);
});
router.patch('/:id/blacklist', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(vendorstand_validation_1.vendorStandValidation.blacklistVendorStandSchema), vendorstand_controller_1.vendorStandController.blacklistVendorStand);
router.patch('/:id/soft-delete', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.VENDOR), 
// validateRequest(vendorStandValidation.softDeleteVendorStandSchema),
vendorstand_controller_1.vendorStandController.softDelete);
exports.vendorStandRoutes = router;
