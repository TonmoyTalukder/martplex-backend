import { Request, Response } from 'express';
import { sendResponse } from '../../../helpers/responseHelper';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import {
  categoryFilterableFields,
  categoryFilterableOptions,
} from './category.constant';
import { categoryService } from './category.service';

const getCategoryByID = catchAsync(async (req, res, next) => {
  const result = await categoryService.getCategoryByID(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category by ID data fetched!',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, categoryFilterableFields);
  const options = pick(req.query, categoryFilterableOptions);
  const result = await categoryService.getAllCategories(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category data fetched!',
    meta: result.meta,
    data: result.data,
  });
});

const createCategory = catchAsync(async (req, res, next) => {
  const result = await categoryService.createCategory(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category created successfully.',
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const result = await categoryService.updateCategory(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category updated successfully.',
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await categoryService.softDelete(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category deleted successfully!',
    data: result,
  });
});

export const categoryController = {
  getAllCategories,
  getCategoryByID,
  createCategory,
  updateCategory,
  softDelete,
};
