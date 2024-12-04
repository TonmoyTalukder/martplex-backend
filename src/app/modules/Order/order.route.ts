import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { orderValidation } from './order.validation';
import { orderController } from './order.controller';

const router = express.Router();

router.get(
  '/:id',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  validateRequest(orderValidation.getOrderByIDSchema),
  orderController.getOrderByID,
);

router.get(
    '/', 
    auth(
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.VENDOR,
        UserRole.CUSTOMER,
      ),
    orderController.getAllOrders);

router.post(
  '/create-order',
  auth(UserRole.VENDOR, UserRole.CUSTOMER),
  validateRequest(orderValidation.createOrderSchema),
  orderController.createOrder,
);

router.post(
  '/update-order',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  validateRequest(orderValidation.updateOrderSchema),
  orderController.updateOrder,
);

router.patch(
  '/:id/delete',
  auth(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  validateRequest(orderValidation.deleteOrderSchema),
  orderController.deleteOrder,
);

export const orderRoutes = router;
