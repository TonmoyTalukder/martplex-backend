import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { cartValidation } from './cart.validation';
import { cartController } from './cart.controller';

const router = express.Router();

router.get(
  '/:id',
  auth(UserRole.VENDOR, UserRole.CUSTOMER),
  validateRequest(cartValidation.getCartByIDSchema),
  cartController.getCartByID,
);

router.post(
  '/create-cart',
  auth(UserRole.VENDOR, UserRole.CUSTOMER),
  validateRequest(cartValidation.createCartSchema),
  cartController.createCart,
);

router.post(
  '/:id/update-cart',
  auth(UserRole.VENDOR, UserRole.CUSTOMER),
  validateRequest(cartValidation.updateCartSchema),
  cartController.updateCart,
);

router.put(
  'cart-item/:id/update',
  auth(UserRole.VENDOR, UserRole.CUSTOMER),
  validateRequest(cartValidation.updateCartItemSchema),
  cartController.updateCartItem,
);

router.patch(
  '/:id/delete',
  auth(UserRole.VENDOR, UserRole.CUSTOMER),
  validateRequest(cartValidation.deleteCartSchema),
  cartController.deleteCart,
);

router.patch(
  'cart-item/:id/delete',
  auth(UserRole.VENDOR, UserRole.CUSTOMER),
  validateRequest(cartValidation.deleteCartItemSchema),
  cartController.deleteCartItem,
);

export const cartRoutes = router;
