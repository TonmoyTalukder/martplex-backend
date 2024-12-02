import express from 'express';
import { authControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post('/register', authControllers.registerUser);

router.post('/verify', authControllers.verifyUser);

router.post('/login', authControllers.loginUser);

router.post('/refreshToken', authControllers.refreshToken);

router.post(
  '/change-password',
  auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.CUSTOMER, UserRole.SUPER_ADMIN),
  authControllers.changePassword,
);

router.post('/forgot-password', authControllers.forgotPassword);

router.post('/reset-password', authControllers.resetPassword)

export const authRoutes = router;
