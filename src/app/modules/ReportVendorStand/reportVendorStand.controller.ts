import { Request, Response } from 'express';
import { sendResponse } from '../../../helpers/responseHelper';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { reportVendorStandFilterableFields, reportVendorStandFilterableOptions } from './reportVendorStand.constant';
import { reportVendorStandService } from './reportVendorStand.service';

const getAllReportVendorStands = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, reportVendorStandFilterableFields);
  const options = pick(req.query, reportVendorStandFilterableOptions);
  const result = await reportVendorStandService.getAllReportVendorStands(
    filters,
    options,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Report data fetched!',
    meta: result.meta,
    data: result.data,
  });
});

const getReportVendorStandByID = catchAsync(async (req, res, next) => {
  const result = await reportVendorStandService.getReportVendorStandByID(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Report by ID data fetched!',
    data: result,
  });
});

const createReportVendorStand = catchAsync(async (req, res, next) => {
  const result = await reportVendorStandService.createReportVendorStand(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Report created successfully.',
    data: result,
  });
});

const updateReportVendorStand = catchAsync(async (req, res, next) => {
  const result = await reportVendorStandService.updateReportVendorStand(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Report updated successfully.',
    data: result,
  });
});

const deleteReportVendorStand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await reportVendorStandService.deleteReportVendorStand(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Report deleted successfully!',
    data: result,
  });
});

export const reportVendorStandController = {
  getAllReportVendorStands,
  getReportVendorStandByID,
  createReportVendorStand,
  updateReportVendorStand,
  deleteReportVendorStand,
};
