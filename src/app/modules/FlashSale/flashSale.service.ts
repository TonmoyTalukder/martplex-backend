import {
  Cart,
  CartItem,
  Coupon,
  FlashSale,
  Order,
  OrderItem,
  OrderStatus,
  Prisma,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import { Request } from 'express';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../interfaces/pagination';

const getAllFlashSales = async (params: any, options: IPaginationOptions) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.FlashSaleWhereInput[] = [];

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.FlashSaleWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.flashSale.findMany({
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

  const total = await prisma.flashSale.count({
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

const getFlashSaleByID = async (req: Request) => {
  const flashSaleInfo = await prisma.flashSale.findUniqueOrThrow({
    where: {
      id: req.body.id,
    },
  });

  return { flashSaleInfo };
};

const createFlashSale = async (req: Request): Promise<FlashSale> => {
  const { name, description, discount, startsAt, endsAt, productIds } =
    req.body;

  const result = await prisma.$transaction(async (prisma) => {
    const flashSale = await prisma.flashSale.create({
      data: {
        name,
        description,
        discount,
        startsAt,
        endsAt,
        isActive: true,
        products: {
          connect: productIds.map((id: string) => ({ id })),
        },
      },
    });

    await prisma.product.updateMany({
      where: {
        id: { in: productIds },
      },
      data: {
        flashSale: true,
      },
    });

    return flashSale;
  });

  return result;
};

const updateFlashSale = async (req: Request): Promise<FlashSale> => {
  const {
    flashSaleId,
    name,
    description,
    discount,
    startsAt,
    endsAt,
    isActive,
  } = req.body;

  const existingFlashSale = await prisma.flashSale.findUniqueOrThrow({
    where: { id: flashSaleId },
  });

  const result = await prisma.flashSale.update({
    where: { id: existingFlashSale.id },
    data: { name, description, discount, startsAt, endsAt, isActive },
  });
  
  if (!isActive) {
    // Set flashSale field to false for associated products
    await prisma.product.updateMany({
      where: { flashSaleId },
      data: { flashSale: false },
    });
  }

  return result;
};

const updateFlashSaleStatus = async (req: Request): Promise<FlashSale> => {
  const { flashSaleId, isActive } = req.body;

  // Update the flash sale status
  const flashSale = await prisma.flashSale.update({
    where: { id: flashSaleId },
    data: { isActive },
  });

  if (!isActive) {
    // Set flashSale field to false for associated products
    await prisma.product.updateMany({
      where: { flashSaleId },
      data: { flashSale: false },
    });
  }

  return flashSale;
};

const deleteFlashSale = async (
  flashSaleId: string,
): Promise<{ message: string }> => {
  if (!flashSaleId) {
    throw new Error('Flash Sale ID is required.');
  }

  await prisma.flashSale.delete({
    where: { id: flashSaleId },
  });

  return { message: 'Flash Sale deleted successfully.' };
};

export const flashSaleService = {
  getAllFlashSales,
  getFlashSaleByID,
  createFlashSale,
  updateFlashSale,
  updateFlashSaleStatus,
  deleteFlashSale,
};
