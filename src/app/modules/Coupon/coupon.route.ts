import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { couponValidation } from './coupon.validation';
import { couponController } from './coupon.controller';

const router = express.Router();

router.get(
  '/:id',
  auth(UserRole.VENDOR),
  validateRequest(couponValidation.getCouponByIDSchema),
  couponController.getCouponByID,
);

router.get('/', couponController.getAllCoupons);

router.post(
  '/create-coupon',
  auth(UserRole.VENDOR),
  validateRequest(couponValidation.createCouponSchema),
  couponController.createCoupon,
);

router.post(
  '/:id/update-coupon',
  auth(UserRole.VENDOR),
  validateRequest(couponValidation.updateCouponSchema),
  couponController.updateCoupon,
);

router.patch(
  '/:id/delete',
  auth(UserRole.VENDOR),
  validateRequest(couponValidation.deleteCouponSchema),
  couponController.deleteCoupon,
);

export const couponRoutes = router;
