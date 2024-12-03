import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../../helpers/fileUploader';
import validateRequest from '../../middlewares/validateRequest';
import { vendorStandController } from './vendorstand.controller';
import { vendorStandValidation } from './vendorstand.validation';

const router = express.Router();

router.get(
    '/follow-vendor-stand',
    validateRequest(vendorStandValidation.followVendorStandSchema),
    vendorStandController.followVendorStand,
  );

router.get(
    '/vendor-stand/followers',
    validateRequest(vendorStandValidation.getVendorStandFollowersSchema),
    vendorStandController.getVendorStandFollowers,
  );

router.get(
    '/vendor-stand/followed',
    validateRequest(vendorStandValidation.getFollowedVendorStandsSchema),
    vendorStandController.getFollowedVendorStands,
  );

router.get(
    '/:id',
    validateRequest(vendorStandValidation.getVendorStandByIDSchema),
    vendorStandController.getVendorStandByID,
  );
  
  router.get(
    '/',
    vendorStandController.getAllVendorStands,
  );

router.post(
  '/create-vendor-stand',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VENDOR),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = vendorStandValidation.createVendorStandSchema.parse(
      JSON.parse(req.body.data),
    );
    return vendorStandController.createVendorStand(req, res, next);
  },
);

router.patch(
  '/update-vendor-stand',
  auth(
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.SUPER_ADMIN,
  ),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return vendorStandController.updateVendorStand(req, res, next);
  },
);

router.patch(
  '/:id/blacklist',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(vendorStandValidation.blacklistVendorStandSchema),
  vendorStandController.blacklistVendorStand,
);

router.patch(
  '/:id/soft-delete',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VENDOR),
  validateRequest(vendorStandValidation.softDeleteVendorStandSchema),
  vendorStandController.softDelete,
);

export const vendorStandRoutes = router;
