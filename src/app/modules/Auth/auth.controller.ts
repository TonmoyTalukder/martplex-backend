import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { authServices } from './auth.service';
import { sendResponse } from '../../../helpers/responseHelper';
import { StatusCodes } from 'http-status-codes';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.registerUser(req.body);

  const { refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Registered successfully!',
    data: {
      accessToken: result.accessToken,
    },
  });
});

const verifyUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.verifyUser(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User verified successfully!',
    data: {
      accessToken: result,
    },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginUser(req.body);

  const { refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Logged in successfully!',
    data: {
      accessToken: result.accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Access token generated successfully!',
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;

    const result = await authServices.changePassword(user, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Password changed successfully!',
      data: result,
    });
  },
);

const forgotPassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    await authServices.forgotPassword(req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Check your email.',
      data: null,
    });
  },
);

const resetPassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const token = req.headers.authorization || '';

    await authServices.resetPassword(token, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Password reset',
      data: null,
    });
  },
);

export const authControllers = {
  registerUser,
  verifyUser,
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
