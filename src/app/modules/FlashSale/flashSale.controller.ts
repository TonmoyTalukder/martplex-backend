import { Request, Response } from 'express';
import { sendResponse } from '../../../helpers/responseHelper';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { flashSaleService } from './flashSale.service';
import { flashSaleFilterableFields, flashSaleFilterableOptions } from './flashSale.constant';


const getAllFlashSales = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, flashSaleFilterableFields);
  const options = pick(req.query, flashSaleFilterableOptions);
  const result = await flashSaleService.getAllFlashSales(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Flash sale data fetched!',
    meta: result.meta,
    data: result.data,
  });
});

const getFlashSaleByID = catchAsync(async (req, res, next) => {
  const result = await flashSaleService.getFlashSaleByID(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Flash sale by ID data fetched!',
    data: result,
  });
});

const createFlashSale = catchAsync(async (req, res, next) => {
  const result = await flashSaleService.createFlashSale(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Flash sale created successfully.',
    data: result,
  });
});

const updateFlashSale = catchAsync(async (req, res, next) => {
  const result = await flashSaleService.updateFlashSale(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Flash sale updated successfully.',
    data: result,
  });
});

const updateFlashSaleStatus = catchAsync(async (req, res, next) => {
  const result = await flashSaleService.updateFlashSaleStatus(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Flash sale status updated successfully.',
    data: result,
  });
});

const deleteFlashSale = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await flashSaleService.deleteFlashSale(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Flash sale deleted successfully!',
    data: result,
  });
});

export const flashSaleController = {
  getAllFlashSales,
  getFlashSaleByID,
  createFlashSale,
  updateFlashSale,
  updateFlashSaleStatus,
  deleteFlashSale,
};
