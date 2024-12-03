import { Request, RequestHandler, Response } from 'express';
import { sendResponse } from '../../../helpers/responseHelper';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import {
  recentProductFilterableFields,
  recentProductFilterableOptions,
} from './recentproduct.constant';
import { recentProductService } from './recentproduct.service';

const getAllRecentProducts = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, recentProductFilterableFields);
  const options = pick(req.query, recentProductFilterableOptions);
  const result = await recentProductService.getAllRecentProducts(
    filters,
    options,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Recent Product data fetched!',
    data: result.data,
  });
});

const getRecentProductByID = catchAsync(async (req, res, next) => {
  const result = await recentProductService.getRecentProductByID(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Recent Product by ID data fetched!',
    data: result,
  });
});

const createRecentProduct = catchAsync(async (req, res, next) => {
  const result = await recentProductService.createRecentProduct(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Recent Product created successfully.',
    data: result,
  });
});

const updateRecentProduct = catchAsync(async (req, res, next) => {
  const { id, viewedAt } = req.body;

  const result = await recentProductService.updateRecentProduct(id, viewedAt);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Recent Product updated successfully.',
    data: result,
  });
});

export const recentProductController = {
  getAllRecentProducts,
  getRecentProductByID,
  createRecentProduct,
  updateRecentProduct,
};
