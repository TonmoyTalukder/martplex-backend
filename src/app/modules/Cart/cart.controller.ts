import { Request, Response } from 'express';
import { sendResponse } from '../../../helpers/responseHelper';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import { cartService } from './cart.service';

const getCartByID = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await cartService.getCartByID(id, req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Cart by ID data fetched!',
    data: result,
  });
});

const createCart = catchAsync(async (req, res, next) => {
  const result = await cartService.createCart(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Cart created successfully.',
    data: result,
  });
});

const updateCart = catchAsync(async (req, res, next) => {
  const result = await cartService.updateCart(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Cart updated successfully.',
    data: result,
  });
});

const updateCartItem = catchAsync(async (req, res, next) => {
  const result = await cartService.updateCartItem(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Cart Item updated successfully.',
    data: result,
  });
});

const deleteCart = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await cartService.deleteCart(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Cart deleted successfully!',
    data: result,
  });
});

const deleteCartItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await cartService.deleteCartItem(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Cart Item deleted successfully!',
    data: result,
  });
});

export const cartController = {
  getCartByID,
  createCart,
  updateCart,
  updateCartItem,
  deleteCart,
  deleteCartItem,
};
