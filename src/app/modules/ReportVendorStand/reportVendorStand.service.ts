import {
  Prisma,
  ReportProduct,
  ReportVendorStand,
  UserStatus,
  VendorStandStatus,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import { Request } from 'express';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../interfaces/pagination';

const getAllReportVendorStands = async (
  params: any,
  options: IPaginationOptions,
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.ReportVendorStandWhereInput[] = [];

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ReportVendorStandWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.reportVendorStand.findMany({
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

  const total = await prisma.reportVendorStand.count({
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

const getReportVendorStandByID = async (req: Request) => {
  const reportVendorStandInfo = await prisma.reportVendorStand.findUniqueOrThrow({
    where: {
      id: req.body.id,
    },
    include: {
      vendorStand: true,
      user: true,
    },
  });

  return { reportVendorStandInfo };
};

const createReportVendorStand = async (req: Request): Promise<ReportVendorStand> => {
  const { content, userId, vendorStandId } = req.body;

  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.vendorStand.findUniqueOrThrow({
    where: {
      id: vendorStandId,
      status: VendorStandStatus.ACTIVE,
      isDeleted: false,
    },
  });

  const result = await prisma.reportVendorStand.create({
    data: {
      content,
      userId,
      vendorStandId,
    },
  });

  return result;
};

const updateReportVendorStand = async (req: Request): Promise<ReportVendorStand> => {
  const { reportId, content, userId, vendorStandId } = req.body;
  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.vendorStand.findUniqueOrThrow({
    where: {
      id: vendorStandId,
      status: VendorStandStatus.ACTIVE,
      isDeleted: false,
    },
  });

  const existingVendorStand = await prisma.reportVendorStand.findUniqueOrThrow({
    where: { id: reportId },
  });

  const result = await prisma.reportVendorStand.update({
    where: { id: existingVendorStand.id },
    data: { content },
  });

  return result;
};

const deleteReportVendorStand = async (
  reportId: string,
): Promise<{ message: string }> => {
  if (!reportId) {
    throw new Error('Report ID is required.');
  }

  await prisma.reportVendorStand.delete({
    where: { id: reportId },
  });

  return { message: 'Report deleted successfully.' };
};

export const reportVendorStandService = {
  getAllReportVendorStands,
  getReportVendorStandByID,
  createReportVendorStand,
  updateReportVendorStand,
  deleteReportVendorStand,
};
