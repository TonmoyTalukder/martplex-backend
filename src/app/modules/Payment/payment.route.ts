import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { paymentValidation } from './payment.validation';
import { paymentController } from './payment.controller';
import catchAsync from '../../../shared/catchAsync';
import { aamarpayController } from '../Aamarpay/aamarpay.controller';

const router = express.Router();

router.get(
  '/:id',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  validateRequest(paymentValidation.getPaymentByIDSchema),
  paymentController.getPaymentByID,
);

router.get(
  '/',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  paymentController.getAllPayments,
);

router.patch(
  '/:id/update/payment-method',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER),
  validateRequest(paymentValidation.updatePaymentMethodSchema),
  paymentController.updatePaymentMethod,
);

router.patch(
  '/unsuccessful/:id/delete',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(paymentValidation.deleteUnsuccessfulPaymentSchema),
  paymentController.deleteUnsuccessfulPayment,
);

router.patch(
  '/:id/delete',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(paymentValidation.deletePaymentSchema),
  paymentController.deletePayment,
);

// Route to initiate payment for a payment
router.post(
  '/initiate-payment/:paymentId',
  auth(UserRole.CUSTOMER),
  catchAsync(paymentController.initiatePayment),
);

router.post('/confirmation', aamarpayController.confirmationController);

export const paymentRoutes = router;
