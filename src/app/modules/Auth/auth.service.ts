import { UserRole, UserStatus } from '@prisma/client';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import emailSender from './emailSender';
import ApiError from '../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const registerUser = async (payload: {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error('Email is already registered.');
  }

  if (payload.password !== payload.confirmPassword) {
    throw new Error('Passwords do not match');
  }

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const verificationCode = crypto.randomBytes(3).toString('hex');
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

  const userData = {
    name: payload.name,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    password: hashedPassword,
    role: UserRole.CUSTOMER,
    isVerified: false,
    verificationCode: await bcrypt.hash(verificationCode, 12),
    verificationCodeExpiresAt: expirationTime,
  };

  await prisma.user.create({
    data: userData,
  });

  // Send verification email
  await emailSender(
    payload.email,
    `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; max-width: 500px; margin: 20px auto; text-align: center;">
        <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Dear ${userData.name},</p>
        <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
            Please verify your email address using the code below:
        </p>
        <p style="font-size: 20px; font-weight: bold; color: #007bff; margin-bottom: 20px;">${verificationCode}</p>
        <p style="color: #555; font-size: 14px;">
            This code will expire in <strong>10 minutes</strong>.
        </p>
    </div>`,
  );

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string,
  );

  return {
    message:
      'Registration successful. Please check your email for the verification code.',
    accessToken,
    refreshToken,
  };
};

const verifyUser = async (payload: {email: string, code: string}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
      isVerified: false,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // if (user.isVerified) {
  //   throw new Error('User is already verified');
  // }

  if (
    !user.verificationCodeExpiresAt ||
    new Date() > user.verificationCodeExpiresAt
  ) {
    throw new Error('Verification code has expired');
  }

  const isCodeValid = await bcrypt.compare(payload.code, user.verificationCode!);

  if (!isCodeValid) {
    throw new Error('Invalid verification code');
  }

  // Update user's verified status
  await prisma.user.update({
    where: { email: payload.email },
    data: {
      status: UserStatus.ACTIVE,
      isVerified: true,
      verificationCode: null,
      verificationCodeExpiresAt: null,
    },
  });

  return { message: 'User successfully verified' };
};

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password,
  );

  if (!isCorrectPassword) {
    throw new Error('Password incorrect!');
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;

  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret,
    );
  } catch (err) {
    throw new Error('You are not authorized!');
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData!.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password,
  );

  if (!isCorrectPassword) {
    throw new Error('Password incorrect!');
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: 'Password changed successfully!',
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPasswordToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.reset_password_token as Secret,
    config.jwt.reset_pass_token_expires_in as string,
  );

  const resetPassLink = `${config.frontend_url}/reset-pass?userId=${userData.id}&token=${resetPasswordToken}`;

  await emailSender(
    userData.email,
    `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; max-width: 500px; margin: 20px auto; text-align: center;">
        <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Dear User,</p>
        <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
            Reset your password within <strong>5 minutes</strong> by clicking the button below:
        </p>
        <a href="${resetPassLink}" style="text-decoration: none;">
            <button
                style="
                    background-color: #007bff; 
                    color: white; 
                    border: none; 
                    border-radius: 5px; 
                    padding: 10px 20px; 
                    font-size: 14px; 
                    font-weight: bold; 
                    cursor: pointer; 
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
                    transition: background-color 0.3s, transform 0.2s;
                "
                onmouseover="this.style.backgroundColor='#0056b3'; this.style.transform='scale(1.05)';"
                onmouseout="this.style.backgroundColor='#007bff'; this.style.transform='scale(1)';"
            >
                Reset Password
            </button>
        </a>
    </div>`,
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string },
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_password_token as Secret,
  );

  if (!isValidToken) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Forbidden!');
  }

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: 'Password reset successful!',
  };
};

export const authServices = {
  registerUser,
  verifyUser,
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
