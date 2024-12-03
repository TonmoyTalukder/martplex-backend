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
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, userFilterableOptions);
  const result = await userService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users data fetched!',
    meta: result.meta,
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

  const result = await userService.becomeVendor(id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile role changed successfuly!',
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await userService.getMyProfile(user! as IAuthUser);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'My profile data fetched!',
      data: result,
    });
  },
);

const updateMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await userService.updateMyProfile(user! as IAuthUser, req);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'My profile updated!',
      data: result,
    });
  },
);

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await userService.softDelete(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User deleted successfuly!',
    data: result,
  });
});

export const userController = {
  createAdmin,
  getAllFromDB,
  changeProfileStatus,
  becomeVendor,
  getMyProfile,
  updateMyProfile,
  softDelete,
};
