import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../../helpers/responseHelper';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import {
  paymentFilterableFields,
  paymentFilterableOptions,
} from './payment.constant';
import { paymentService } from './payment.service';

const getAllPayments = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, paymentFilterableFields);
  const options = pick(req.query, paymentFilterableOptions);
  const result = await paymentService.getAllPayments(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment data fetched!',
    meta: result.meta,
    data: result.data,
  });
});

const getPaymentByID = catchAsync(async (req, res, next) => {
  const result = await paymentService.getPaymentByID(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment by ID data fetched!',
    data: result,
  });
});

const updatePaymentMethod = catchAsync(async (req, res, next) => {
  const { paymentId, paymentMethod } = req.body;
  const result = await paymentService.updatePaymentMethod(
    paymentId,
    paymentMethod,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment Method updated successfully.',
    data: result,
  });
});

const deleteUnsuccessfulPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await paymentService.deletePayment(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Unsuccessful payment deleted successfully!',
      data: result,
    });
  },
);

const deletePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await paymentService.deletePayment(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment deleted successfully!',
    data: result,
  });
});

const initiatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { paymentId } = req.params;
    const { userId, deliveryAddress } = req.body;

    const result = await paymentService.initiatePayment(paymentId, userId, deliveryAddress);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Payment initiated successfully!',
      data: result.paymentSession,
    });
  } catch (error) {
    next(error);
  }
};

export const paymentController = {
  getAllPayments,
  getPaymentByID,
  updatePaymentMethod,
  deleteUnsuccessfulPayment,
  deletePayment,
  initiatePayment,
};
