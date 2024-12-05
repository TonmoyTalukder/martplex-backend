import {
  Prisma,
  ReportProduct,
  UserStatus,
  VendorStandStatus,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import { Request } from 'express';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../interfaces/pagination';

const getAllReportProducts = async (
  params: any,
  options: IPaginationOptions,
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.ReportProductWhereInput[] = [];

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ReportProductWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.reportProduct.findMany({
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

  const total = await prisma.reportProduct.count({
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

const getReportProductByID = async (req: Request) => {
  const reportProductInfo = await prisma.reportProduct.findUniqueOrThrow({
    where: {
      id: req.body.id,
    },
    include: {
      product: true,
      user: true,
    },
  });

  return { reportProductInfo };
};

const createReportProduct = async (req: Request): Promise<ReportProduct> => {
  const { content, userId, productId } = req.body;

  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
      status: UserStatus.ACTIVE,
    },
  });

  const existingProduct = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
      isDeleted: false,
    },
  });

  await prisma.vendorStand.findUniqueOrThrow({
    where: {
      id: existingProduct.vendorStandId,
      status: VendorStandStatus.ACTIVE,
      isDeleted: false,
    },
  });

  const result = await prisma.reportProduct.create({
    data: {
      content,
      userId,
      productId,
    },
  });

  return result;
};

const updateReportProduct = async (req: Request): Promise<ReportProduct> => {
  const { reportId, content, userId, productId } = req.body;

  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
      status: UserStatus.ACTIVE,
    },
  });

  const existingProduct = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
      isDeleted: false,
    },
  });

  await prisma.vendorStand.findUniqueOrThrow({
    where: {
      id: existingProduct.vendorStandId,
      status: VendorStandStatus.ACTIVE,
      isDeleted: false,
    },
  });

  const existingReport = await prisma.reportProduct.findUniqueOrThrow({
    where: { id: reportId },
  });

  const result = await prisma.reportProduct.update({
    where: { id: existingReport.id },
    data: { content },
  });

  return result;
};

const deleteReportProduct = async (
  reportId: string,
): Promise<{ message: string }> => {
  if (!reportId) {
    throw new Error('Report ID is required.');
  }

  await prisma.reportProduct.delete({
    where: { id: reportId },
  });

  return { message: 'Report deleted successfully.' };
};

export const reportProductService = {
  getAllReportProducts,
  getReportProductByID,
  createReportProduct,
  updateReportProduct,
  deleteReportProduct,
};
