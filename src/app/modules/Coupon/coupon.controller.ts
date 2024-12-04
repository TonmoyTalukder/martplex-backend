import { Request, Response } from 'express';
import { sendResponse } from '../../../helpers/responseHelper';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import {
  couponFilterableFields,
  couponFilterableOptions,
} from './coupon.constant';
import { couponService } from './coupon.service';

const getAllCoupons = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, couponFilterableFields);
  const options = pick(req.query, couponFilterableOptions);
  const result = await couponService.getAllCoupons(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupon data fetched!',
    meta: result.meta,
    data: result.data,
  });
});

const getCouponByID = catchAsync(async (req, res, next) => {
  const result = await couponService.getCouponByID(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupon by ID data fetched!',
    data: result,
  });
});

const createCoupon = catchAsync(async (req, res, next) => {
  const result = await couponService.createCoupon(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupon created successfully.',
    data: result,
  });
});

const updateCoupon = catchAsync(async (req, res, next) => {
  const result = await couponService.updateCoupon(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupon updated successfully.',
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await couponService.deleteCoupon(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupon deleted successfully!',
    data: result,
  });
});

export const couponController = {
  getAllCoupons,
  getCouponByID,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
