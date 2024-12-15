"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpers/fileUploader");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const product_validation_1 = require("./product.validation");
const product_controller_1 = require("./product.controller");
const router = express_1.default.Router();
router.get('/:id', (0, validateRequest_1.default)(product_validation_1.productValidation.getProductByIDSchema), product_controller_1.productController.getProductByID);
router.get('/', product_controller_1.productController.getAllProducts);
router.post('/create-product', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.VENDOR), fileUploader_1.fileUploader.upload.array('files', 10), // Allow multiple files (up to 10)
(req, res, next) => {
    req.body = product_validation_1.productValidation.createProductSchema.parse(JSON.parse(req.body.data));
    return product_controller_1.productController.createProduct(req, res, next);
});
router.patch('/:id/update-product', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.SUPER_ADMIN), fileUploader_1.fileUploader.upload.array('files', 10), // Allow multiple files (up to 10)
(req, res, next) => {
    req.body = product_validation_1.productValidation.updateProductSchema.parse(JSON.parse(req.body.data));
    return product_controller_1.productController.updateProduct(req, res, next);
});
router.patch('/:id/soft-delete', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.VENDOR), (0, validateRequest_1.default)(product_validation_1.productValidation.softDeleteProductSchema), product_controller_1.productController.softDelete);
exports.productRoutes = router;
