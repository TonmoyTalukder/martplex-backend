import express, { Request, Response } from 'express';
import { authRoutes } from '../modules/Auth/auth.routes';
import { userRoutes } from '../modules/User/user.routes';
import { vendorStandRoutes } from '../modules/VendorStand/vendorstand.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/vendor-stand',
    route: vendorStandRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
