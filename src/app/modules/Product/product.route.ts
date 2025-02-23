import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../../helpers/fileUploader';
import validateRequest from '../../middlewares/validateRequest';
import { productValidation } from './product.validation';
import { productController } from './product.controller';

const router = express.Router();

router.get(
  '/:id',
  // validateRequest(productValidation.getProductByIDSchema),
  productController.getProductByID,
);

router.get('/', productController.getAllProducts);

router.post(
  '/create-product',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VENDOR),
  fileUploader.upload.array('files', 10),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = productValidation.createProductSchema.parse(
      JSON.parse(req.body.data),
    );
    return productController.createProduct(req, res, next);
  },
);

router.patch(
  '/:id/update-product',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VENDOR),
  fileUploader.upload.array('files', 10),
  (req: Request, res: Response, next: NextFunction) => {
    console.log("API HITTED")
    req.body = productValidation.updateProductSchema.parse(
      JSON.parse(req.body.data),
    );
    console.log("API HITTED")
    return productController.updateProduct(req, res, next);
  },
);

router.patch(
  '/:id/soft-delete',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VENDOR),
  // validateRequest(productValidation.softDeleteProductSchema),
  productController.softDelete,
);

export const productRoutes = router;
