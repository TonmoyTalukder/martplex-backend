import { Request, Response } from 'express';
import { sendResponse } from '../../../helpers/responseHelper';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import {
  reportProductFilterableFields,
  reportProductFilterableOptions,
} from './reportProduct.constant';
import { reportProductService } from './reportProduct.service';

const getAllReportProducts = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, reportProductFilterableFields);
  const options = pick(req.query, reportProductFilterableOptions);
  const result = await reportProductService.getAllReportProducts(
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

const getReportProductByID = catchAsync(async (req, res, next) => {
  const result = await reportProductService.getReportProductByID(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Report by ID data fetched!',
    data: result,
  });
});

const createReportProduct = catchAsync(async (req, res, next) => {
  const result = await reportProductService.createReportProduct(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Report created successfully.',
    data: result,
  });
});

const updateReportProduct = catchAsync(async (req, res, next) => {
  const result = await reportProductService.updateReportProduct(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Report updated successfully.',
    data: result,
  });
});

const deleteReportProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await reportProductService.deleteReportProduct(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Report deleted successfully!',
    data: result,
  });
});

export const reportProductController = {
  getAllReportProducts,
  getReportProductByID,
  createReportProduct,
  updateReportProduct,
  deleteReportProduct,
};
