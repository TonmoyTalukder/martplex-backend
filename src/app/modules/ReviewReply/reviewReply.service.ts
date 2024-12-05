import { Prisma, Reply, Review } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { Request } from 'express';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../interfaces/pagination';

const getAllReviewReplies = async (
  params: any,
  options: IPaginationOptions,
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.ReviewWhereInput[] = [];

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ReviewWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.review.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getReviewReplyByID = async (req: Request) => {
  const reviewReplyInfo = await prisma.review.findUniqueOrThrow({
    where: {
      id: req.body.id,
    },
    include: {
      reply: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return { reviewReplyInfo };
};

const createReview = async (req: Request): Promise<Review> => {
  const { content, rating, userId, productId, vendorStandId, orderId } =
    req.body;

  const result = await prisma.review.create({
    data: {
      content,
      rating,
      userId,
      productId,
      vendorStandId,
      orderId,
    },
  });

  return result;
};

const createReply = async (req: Request): Promise<Reply> => {
  const { content, userId, reviewId } = req.body;

  await prisma.review.findUniqueOrThrow({
    where: { id: reviewId },
  });

  const result = await prisma.reply.create({
    data: {
      content,
      userId,
      reviewId,
    },
  });

  return result;
};

const updateReview = async (req: Request): Promise<Review> => {
  const { reviewId, content, rating } = req.body;

  const existingReview = await prisma.review.findUniqueOrThrow({
    where: { id: reviewId },
  });

  const result = await prisma.review.update({
    where: { id: existingReview.id },
    data: { content, rating },
  });

  return result;
};

const updateReply = async (req: Request): Promise<Reply> => {
  const { replyId, content } = req.body;

  const existingReply = await prisma.reply.findUniqueOrThrow({
    where: { id: replyId },
  });

  await prisma.review.findUniqueOrThrow({
    where: { id: existingReply.reviewId },
  });

  const result = await prisma.reply.update({
    where: { id: existingReply.id },
    data: { content },
  });

  return result;
};

const deleteReview = async (reviewId: string): Promise<{ message: string }> => {
  if (!reviewId) {
    throw new Error('Review ID is required.');
  }

  await prisma.$transaction(async (prisma) => {
    await prisma.reply.deleteMany({
      where: { reviewId },
    });

    await prisma.review.delete({
      where: { id: reviewId },
    });
  });

  return { message: 'Review deleted successfully.' };
};

const deleteReply = async (replyId: string): Promise<{ message: string }> => {
  if (!replyId) {
    throw new Error('Reply ID is required.');
  }

  await prisma.reply.delete({
    where: { id: replyId },
  });

  return { message: 'Reply deleted successfully.' };
};

export const reviewReplyService = {
  getAllReviewReplies,
  getReviewReplyByID,
  createReview,
  createReply,
  updateReview,
  updateReply,
  deleteReview,
  deleteReply,
};
