import { Request, Response } from 'express';
import { sendResponse } from '../../../helpers/responseHelper';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import { orderService } from './order.service';
import pick from '../../../shared/pick';
import {
  orderFilterableFields,
  orderFilterableOptions,
} from './order.constant';

const getAllOrders = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, orderFilterableFields);
  const options = pick(req.query, orderFilterableOptions);
  const result = await orderService.getAllOrders(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order data fetched!',
    meta: result.meta,
    data: result.data,
  });
});

const getOrderByID = catchAsync(async (req, res, next) => {
  const result = await orderService.getOrderByID(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order by ID data fetched!',
    data: result,
  });
});

const createOrder = catchAsync(async (req, res, next) => {
  const result = await orderService.createOrder(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order created successfully.',
    data: result,
  });
});

const updateOrder = catchAsync(async (req, res, next) => {
  const result = await orderService.updateOrder(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order updated successfully.',
    data: result,
  });
});

const updateOrderItem = catchAsync(async (req, res, next) => {
  const result = await orderService.updateOrderItem(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order Item updated successfully.',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await orderService.deleteOrder(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order deleted successfully!',
    data: result,
  });
});

const deleteOrderItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await orderService.deleteOrderItem(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order Item deleted successfully!',
    data: result,
  });
});

export const orderController = {
  getAllOrders,
  getOrderByID,
  createOrder,
  updateOrder,
  updateOrderItem,
  deleteOrder,
  deleteOrderItem,
};
