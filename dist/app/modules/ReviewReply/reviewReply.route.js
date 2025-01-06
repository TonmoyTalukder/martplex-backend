"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewReplyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const reviewReply_validation_1 = require("./reviewReply.validation");
const reviewReply_controller_1 = require("./reviewReply.controller");
const router = express_1.default.Router();
router.get('/:id', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(reviewReply_validation_1.reviewReplyValidation.getReviewReplyByIDSchema), reviewReply_controller_1.reviewReplyController.getReviewReplyByID);
router.get('/', reviewReply_controller_1.reviewReplyController.getAllReviewReplies);
router.post('/create', (0, auth_1.default)(client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(reviewReply_validation_1.reviewReplyValidation.createReviewSchema), reviewReply_controller_1.reviewReplyController.createReview);
router.post('/reply/create', (0, auth_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR), 
// validateRequest(reviewReplyValidation.createReplySchema),
reviewReply_controller_1.reviewReplyController.createReply);
router.patch('/:id/update', (0, auth_1.default)(client_1.UserRole.CUSTOMER), 
// validateRequest(reviewReplyValidation.updateReviewSchema),
reviewReply_controller_1.reviewReplyController.updateReview);
router.patch('/reply/:id/update', (0, auth_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR), 
// validateRequest(reviewReplyValidation.updateReplySchema),
reviewReply_controller_1.reviewReplyController.updateReply);
router.patch('/:id/delete', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER, client_1.UserRole.SUPER_ADMIN), 
// validateRequest(reviewReplyValidation.deleteReviewSchema),
reviewReply_controller_1.reviewReplyController.deleteReview);
router.patch('/reply/:id/delete', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR, client_1.UserRole.SUPER_ADMIN), 
// validateRequest(reviewReplyValidation.deleteReplySchema),
reviewReply_controller_1.reviewReplyController.deleteReply);
exports.reviewReplyRoutes = router;
