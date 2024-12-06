import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { reviewReplyValidation } from './reviewReply.validation';
import { reviewReplyController } from './reviewReply.controller';

const router = express.Router();

router.get(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VENDOR, UserRole.CUSTOMER),
  validateRequest(reviewReplyValidation.getReviewReplyByIDSchema),
  reviewReplyController.getReviewReplyByID,
);

router.get('/', reviewReplyController.getAllReviewReplies);

router.post(
  '/create',
  auth(UserRole.CUSTOMER),
  validateRequest(reviewReplyValidation.createReviewSchema),
  reviewReplyController.createReview,
);

router.post(
  '/reply/create',
  auth(UserRole.CUSTOMER, UserRole.VENDOR),
  validateRequest(reviewReplyValidation.createReplySchema),
  reviewReplyController.createReply,
);

router.put(
  '/:id/update',
  auth(UserRole.CUSTOMER),
  validateRequest(reviewReplyValidation.updateReviewSchema),
  reviewReplyController.updateReview,
);

router.post(
  '/reply/:id/update',
  auth(UserRole.CUSTOMER, UserRole.VENDOR),
  validateRequest(reviewReplyValidation.updateReplySchema),
  reviewReplyController.updateReply,
);

router.patch(
  '/:id/delete',
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SUPER_ADMIN),
  validateRequest(reviewReplyValidation.deleteReviewSchema),
  reviewReplyController.deleteReview,
);

router.patch(
  '/reply/:id/delete',
  auth(
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.VENDOR,
    UserRole.SUPER_ADMIN,
  ),
  validateRequest(reviewReplyValidation.deleteReplySchema),
  reviewReplyController.deleteReply,
);

export const reviewReplyRoutes = router;
