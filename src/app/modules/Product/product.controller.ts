import { Request, Response } from 'express';
import { sendResponse } from '../../../helpers/responseHelper';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { productService } from './product.service';
import {
  productFilterableFields,
  productFilterableOptions,
} from './product.constant';

const getAllProducts = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, productFilterableFields);
  const options = pick(req.query, productFilterableOptions);
  const result = await productService.getAllProducts(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product data fetched!',
    meta: result.meta,
    data: result.data,
  });
});

const getProductByID = catchAsync(async (req, res, next) => {
  const result = await productService.getProductByID(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product by ID data fetched!',
    data: result,
  });
});

const createProduct = catchAsync(async (req, res, next) => {
  const result = await productService.createProduct(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product created successfully.',
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await productService.updateProduct(id, req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product updated successfully.',
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await productService.softDelete(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product deleted successfully!',
    data: result,
  });
});

export const productController = {
  getAllProducts,
  getProductByID,
  createProduct,
  updateProduct,
  softDelete,
};
