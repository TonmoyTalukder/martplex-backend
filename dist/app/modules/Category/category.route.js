"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_validation_1 = require("./category.validation");
const category_controller_1 = require("./category.controller");
const router = express_1.default.Router();
router.get('/:id', (0, validateRequest_1.default)(category_validation_1.categoryValidation.getCategoryByIDSchema), category_controller_1.categoryController.getCategoryByID);
router.get('/', category_controller_1.categoryController.getAllCategories);
router.post('/create-category', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.VENDOR), (0, validateRequest_1.default)(category_validation_1.categoryValidation.createCategorySchema), category_controller_1.categoryController.createCategory);
router.patch('/:id/update-category', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(category_validation_1.categoryValidation.updateCategorySchema), category_controller_1.categoryController.updateCategory);
router.patch('/:id/soft-delete', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.VENDOR), (0, validateRequest_1.default)(category_validation_1.categoryValidation.softDeleteCategorySchema), category_controller_1.categoryController.softDelete);
exports.categoryRoutes = router;
