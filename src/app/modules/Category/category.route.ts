import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../../helpers/fileUploader';
import validateRequest from '../../middlewares/validateRequest';
import { categoryValidation } from './category.validation';
import { categoryController } from './category.controller';

const router = express.Router();

router.get(
  '/:id',
  validateRequest(categoryValidation.getCategoryByIDSchema),
  categoryController.getCategoryByID,
);

router.get('/', categoryController.getAllCategories);

router.post(
  '/create-category',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VENDOR),
  validateRequest(categoryValidation.createCategorySchema),
  categoryController.createCategory,
);

router.patch(
  '/:id/update-category',
  auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.SUPER_ADMIN),
  validateRequest(categoryValidation.updateCategorySchema),
  categoryController.updateCategory,
);

router.patch(
  '/:id/soft-delete',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VENDOR),
  validateRequest(categoryValidation.softDeleteCategorySchema),
  categoryController.softDelete,
);

export const categoryRoutes = router;
