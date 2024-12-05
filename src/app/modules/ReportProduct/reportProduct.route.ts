import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { reportProductValidation } from './reportProduct.validation';
import { reportProductController } from './reportProduct.controller';

const router = express.Router();

router.get(
  '/:id',
  auth(UserRole.VENDOR),
  validateRequest(reportProductValidation.getReportProductByIDSchema),
  reportProductController.getReportProductByID,
);

router.get('/', reportProductController.getAllReportProducts);

router.post(
  '/create',
  auth(UserRole.CUSTOMER),
  validateRequest(reportProductValidation.createReportProductSchema),
  reportProductController.createReportProduct,
);

router.post(
  '/:id/update',
  auth(UserRole.CUSTOMER),
  validateRequest(reportProductValidation.updateReportProductSchema),
  reportProductController.updateReportProduct,
);

router.patch(
  '/:id/delete',
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SUPER_ADMIN),
  validateRequest(reportProductValidation.deleteReportProductSchema),
  reportProductController.deleteReportProduct,
);

export const reportProductRoutes = router;
