import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { flashSaleValidation } from './flashSale.validation';
import { flashSaleController } from './flashSale.controller';

const router = express.Router();

router.get(
  '/:id',
  auth(UserRole.VENDOR),
  validateRequest(flashSaleValidation.getFlashSaleByIDSchema),
  flashSaleController.getFlashSaleByID,
);

router.get('/', flashSaleController.getAllFlashSales);

router.post(
  '/create',
  auth(UserRole.VENDOR),
  validateRequest(flashSaleValidation.createFlashSaleSchema),
  flashSaleController.createFlashSale,
);

router.put(
  '/:id/update',
  auth(UserRole.VENDOR),
  validateRequest(flashSaleValidation.updateFlashSaleSchema),
  flashSaleController.updateFlashSale,
);

router.patch(
  '/:id/delete',
  auth(UserRole.VENDOR),
  validateRequest(flashSaleValidation.deleteFlashSaleSchema),
  flashSaleController.deleteFlashSale,
);

export const flashSaleRoutes = router;
