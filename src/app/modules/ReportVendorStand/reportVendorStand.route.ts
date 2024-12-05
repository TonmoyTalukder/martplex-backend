import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { reportVendorStandValidation } from './reportVendorStand.validation';
import { reportVendorStandController } from './reportVendorStand.controller';

const router = express.Router();

router.get(
  '/:id',
  auth(UserRole.VENDOR),
  validateRequest(reportVendorStandValidation.getReportVendorStandByIDSchema),
  reportVendorStandController.getReportVendorStandByID,
);

router.get('/', reportVendorStandController.getAllReportVendorStands);

router.post(
  '/create',
  auth(UserRole.CUSTOMER),
  validateRequest(reportVendorStandValidation.createReportVendorStandSchema),
  reportVendorStandController.createReportVendorStand,
);

router.post(
  '/:id/update',
  auth(UserRole.CUSTOMER),
  validateRequest(reportVendorStandValidation.updateReportVendorStandSchema),
  reportVendorStandController.updateReportVendorStand,
);

router.patch(
  '/:id/delete',
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SUPER_ADMIN),
  validateRequest(reportVendorStandValidation.deleteReportVendorStandSchema),
  reportVendorStandController.deleteReportVendorStand,
);

export const reportVendorStandRoutes = router;
