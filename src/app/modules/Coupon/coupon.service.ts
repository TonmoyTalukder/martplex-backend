import { Coupon, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { Request } from 'express';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../interfaces/pagination';

const getAllCoupons = async (params: any, options: IPaginationOptions) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.CouponWhereInput[] = [];

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.CouponWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.coupon.findMany({
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

  const total = await prisma.coupon.count({
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

const getCouponByID = async (req: Request) => {
  const couponInfo = await prisma.coupon.findUniqueOrThrow({
    where: {
      id: req.body.id,
    },
    include: {
      vendorStand: true,
    },
  });

  return { couponInfo };
};

const createCoupon = async (req: Request): Promise<Coupon> => {
  const { code, discount, expiresAt, vendorStandId } = req.body;

  const result = await prisma.coupon.create({
    data: {
      code,
      discount,
      expiresAt,
      vendorStandId,
      isActive: true,
    },
  });

  return result;
};

const updateCoupon = async (req: Request): Promise<Coupon> => {
  const { couponId, code, discount, expiresAt } = req.body;

  const existingCoupon = await prisma.coupon.findUniqueOrThrow({
    where: { id: couponId },
  });

  const result = await prisma.coupon.update({
    where: { id: existingCoupon.id },
    data: { code, discount, expiresAt },
  });

  return result;
};

const deleteCoupon = async (couponId: string): Promise<{ message: string }> => {
  if (!couponId) {
    throw new Error('Coupon ID is required.');
  }

  await prisma.coupon.delete({
    where: { id: couponId },
  });

  return { message: 'Coupon deleted successfully.' };
};

export const couponService = {
  getAllCoupons,
  getCouponByID,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
