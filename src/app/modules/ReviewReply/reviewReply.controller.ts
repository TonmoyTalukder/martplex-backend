import { Request, Response } from 'express';
import { sendResponse } from '../../../helpers/responseHelper';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { reviewReplyFilterableFields, reviewReplyFilterableOptions } from './reviewReply.constant';
import { reviewReplyService } from './reviewReply.service';

const getAllReviewReplies = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, reviewReplyFilterableFields);
  const options = pick(req.query, reviewReplyFilterableOptions);
  const result = await reviewReplyService.getAllReviewReplies(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review data fetched!',
    meta: result.meta,
    data: result.data,
  });
});

const getReviewReplyByID = catchAsync(async (req, res, next) => {
  const result = await reviewReplyService.getReviewReplyByID(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review by ID data fetched!',
    data: result,
  });
});

const createReview = catchAsync(async (req, res, next) => {
  const result = await reviewReplyService.createReview(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review created successfully.',
    data: result,
  });
});

const createReply = catchAsync(async (req, res, next) => {
  const result = await reviewReplyService.createReply(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reply created successfully.',
    data: result,
  });
});

const updateReview = catchAsync(async (req, res, next) => {
  const result = await reviewReplyService.updateReview(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review updated successfully.',
    data: result,
  });
});

const updateReply = catchAsync(async (req, res, next) => {
  const result = await reviewReplyService.updateReply(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reply updated successfully.',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await reviewReplyService.deleteReview(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review deleted successfully!',
    data: result,
  });
});

const deleteReply = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await reviewReplyService.deleteReply(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reply deleted successfully!',
    data: result,
  });
});

export const reviewReplyController = {
  getAllReviewReplies,
  getReviewReplyByID,
  createReview,
  createReply,
  updateReview,
  updateReply,
  deleteReview,
  deleteReply,
};
