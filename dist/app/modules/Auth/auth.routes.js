"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post('/register', auth_controller_1.authControllers.registerUser);
router.post('/verify-request', auth_controller_1.authControllers.verifyRequest);
router.post('/verify', auth_controller_1.authControllers.verifyUser);
router.post('/login', auth_controller_1.authControllers.loginUser);
router.post('/refresh-token', auth_controller_1.authControllers.refreshToken);
router.post('/change-password', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER, client_1.UserRole.SUPER_ADMIN), auth_controller_1.authControllers.changePassword);
router.post('/forgot-password', auth_controller_1.authControllers.forgotPassword);
router.post('/reset-password/:token', auth_controller_1.authControllers.resetPassword);
exports.authRoutes = router;
