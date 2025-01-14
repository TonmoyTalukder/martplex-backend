import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { flashSaleValidation } from './flashSale.validation';
import { flashSaleController } from './flashSale.controller';

const router = express.Router();

router.get(
  '/:id',
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  // validateRequest(flashSaleValidation.getFlashSaleByIDSchema),
  flashSaleController.getFlashSaleByID,
);

router.get('/', flashSaleController.getAllFlashSales);

router.post(
  '/create',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  // validateRequest(flashSaleValidation.createFlashSaleSchema),
  flashSaleController.createFlashSale,
);

router.put(
  '/update',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  // validateRequest(flashSaleValidation.updateFlashSaleSchema),
  flashSaleController.updateFlashSale,
);

router.put(
  '/update-status',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  flashSaleController.updateFlashSaleStatus,
);

router.patch(
  '/:id/delete',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  // validateRequest(flashSaleValidation.deleteFlashSaleSchema),
  flashSaleController.deleteFlashSale,
);

export const flashSaleRoutes = router;
