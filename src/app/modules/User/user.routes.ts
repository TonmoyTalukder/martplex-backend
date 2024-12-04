import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../../helpers/fileUploader';
import { userValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.get(
  '/me',
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR, UserRole.SUPER_ADMIN),
  userController.getMyProfile,
);

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.getAllFromDB,
);

router.post(
  '/create-admin',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return userController.createAdmin(req, res, next);
  },
);

router.patch(
  '/:id/status',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(userValidation.updateStatus),
  userController.changeProfileStatus,
);

router.patch(
  '/:id/become-vendor',
  auth(UserRole.CUSTOMER, UserRole.VENDOR),
  validateRequest(userValidation.becomeVendor),
  userController.becomeVendor,
);

router.patch(
  '/:id/update-my-profile',
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR, UserRole.SUPER_ADMIN),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return userController.updateMyProfile(req, res, next);
  },
);

router.patch(
  '/:id/block',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.blockUser,
);

router.patch(
  '/:id/soft-delete',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.softDelete,
);

export const userRoutes = router;
