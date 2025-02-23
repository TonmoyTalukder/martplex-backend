import { Request, RequestHandler, Response } from 'express';
import { userService } from './user.service';
import { sendResponse } from '../../../helpers/responseHelper';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { userFilterableFields, userFilterableOptions } from './user.constant';
import { User } from '@prisma/client';
import { IAuthUser } from '../../interfaces/common';

const createAdmin = catchAsync(async (req, res, next) => {
  const result = await userService.createAdmin(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin created successfully.',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res, next) => {
  // const filters = pick(req.query, userFilterableFields);
  // const options = pick(req.query, userFilterableOptions);
  const result = await userService.getAllFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users data fetched!',
    // meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await userService.changeProfileStatus(id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile status changed successfuly!',
    data: result,
  });
});

const becomeVendor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await userService.becomeVendor(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile role changed successfuly!',
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: User }, res: Response) => {
    const user = req.user;

    const result = await userService.getMyProfile(user! as User);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'My profile data fetched!',
      data: result,
    });
  },
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await userService.getUserProfile(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User profile data fetched!',
    data: result,
  });
});

const updateMyProfile = catchAsync(
  async (req: Request & { user?: User }, res: Response) => {
    const user = req.user;

    console.log('Found User: ', user);

    const result = await userService.updateMyProfile(user! as User, req);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'My profile updated!',
      data: result,
    });
  },
);

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { block } = req.body;

  const result = await userService.blockUser(id, block);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User blocked successfuly!',
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await userService.softDelete(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User deleted successfully!',
    data: result,
  });
});

export const userController = {
  createAdmin,
  getAllFromDB,
  changeProfileStatus,
  becomeVendor,
  getMyProfile,
  getUserProfile,
  updateMyProfile,
  blockUser,
  softDelete,
};
