import express, { Request, Response } from 'express';
import { authRoutes } from '../modules/Auth/auth.routes';
import { userRoutes } from '../modules/User/user.routes';
import { vendorStandRoutes } from '../modules/VendorStand/vendorstand.route';
import { productRoutes } from '../modules/Product/product.route';
import { recentProductRoutes } from '../modules/RecentProduct/recentproduct.route';
import { categoryRoutes } from '../modules/Category/category.route';
import { orderRoutes } from '../modules/Order/order.route';

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
    path: '/product',
    route: productRoutes,
  },
  {
    path: '/recent-product',
    route: recentProductRoutes,
  },
  {
    path: '/category',
    route: categoryRoutes,
  },
  {
    path: '/order',
    route: orderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
