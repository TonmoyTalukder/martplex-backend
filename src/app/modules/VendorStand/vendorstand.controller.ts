import { Request, RequestHandler, Response } from 'express';
import { sendResponse } from '../../../helpers/responseHelper';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import { vendorStandService } from './vendorstand.service';
import {
  vendorStandFilterableFields,
  vendorStandFilterableOptions,
} from './vendorstand.constant';
import pick from '../../../shared/pick';

const getAllVendorStands = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, vendorStandFilterableFields);
  const options = pick(req.query, vendorStandFilterableOptions);
  const result = await vendorStandService.getAllVendorStands(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor Stand data fetched!',
    meta: result.meta,
    data: result.data,
  });
});

const getVendorStandByID = catchAsync(async (req, res, next) => {
  const result = await vendorStandService.getVendorStandByID(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor Stand by ID data fetched!',
    data: result,
  });
});

const createVendorStand = catchAsync(async (req, res, next) => {
  const result = await vendorStandService.createVendorStand(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor Stand created successfully.',
    data: result,
  });
});

const updateVendorStand = catchAsync(async (req, res, next) => {
  const result = await vendorStandService.updateVendorStand(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor Stand created successfully.',
    data: result,
  });
});

const blacklistVendorStand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { blacklist } = req.body;

  const result = await vendorStandService.blacklistVendorStand(id, blacklist);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor Stand blacklisted successfuly!',
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await vendorStandService.softDelete(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor Stand deleted successfully!',
    data: result,
  });
});

// Follow VendorStand //
const followVendorStand = catchAsync(async (req, res, next) => {
  const result = await vendorStandService.followVendorStand(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor Stand Followed!',
    data: result,
  });
});

const getVendorStandFollowers = catchAsync(async (req, res, next) => {
  const result = await vendorStandService.getVendorStandFollowers(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor Stand Followers fetched!',
    data: result,
  });
});

const getFollowedVendorStands = catchAsync(async (req, res, next) => {
  const result = await vendorStandService.getFollowedVendorStands(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Followed Vendor Stands fetched!',
    data: result,
  });
});

export const vendorStandController = {
  getAllVendorStands,
  getVendorStandByID,
  createVendorStand,
  updateVendorStand,
  blacklistVendorStand,
  softDelete,
  followVendorStand,
  getVendorStandFollowers,
  getFollowedVendorStands,
};
