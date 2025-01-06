import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../../helpers/fileUploader';
import validateRequest from '../../middlewares/validateRequest';
import { recentProductValidation } from './recentproduct.validation';
import { recentProductController } from './recentproduct.controller';

const router = express.Router();

router.get(
  '/:id',
  auth(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  validateRequest(recentProductValidation.getRecentProductByIDSchema),
  recentProductController.getRecentProductByID,
);

router.get(
  '/',
  auth(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  recentProductController.getAllRecentProducts,
);

router.post(
  '/create-recent-product',
  // auth(
  //   UserRole.ADMIN,
  //   UserRole.SUPER_ADMIN,
  //   UserRole.VENDOR,
  //   UserRole.CUSTOMER,
  // ),
  
  // validateRequest(recentProductValidation.createRecentProductSchema),
  recentProductController.createRecentProduct,
);

router.patch(
  '/:id/update-recent-product',
  auth(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  validateRequest(recentProductValidation.updateRecentProductSchema),
  recentProductController.updateRecentProduct,
);

export const recentProductRoutes = router;
