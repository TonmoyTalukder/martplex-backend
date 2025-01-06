import {
  Prisma,
  Product,
  RecentProduct,
  User,
  UserStatus,
  VendorStandStatus,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import { Request } from 'express';
import { IPaginationOptions } from '../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { recentProductSearchableFields } from './recentproduct.constant';

const getAllRecentProducts = async (
  params: any,
  options: IPaginationOptions,
) => {
  const { searchTerm, ...filterData } = params;

  // Filter conditions
  const andCondition: Prisma.RecentProductWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: recentProductSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.RecentProductWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  // Fetch the latest 10 recent products
  const recentProducts = await prisma.recentProduct.findMany({
    where: whereConditions,
    orderBy: {
      viewedAt: 'desc',
    },
    take: 10, // Get only the latest 10
    include: {
      product: true,
    },
  });

  // Get the total count of recent products
  const total = await prisma.recentProduct.count({
    where: whereConditions,
  });

  // If more than 10, delete older products
  if (total > 10) {
    const idsToDelete = await prisma.recentProduct.findMany({
      where: whereConditions,
      orderBy: {
        viewedAt: 'asc',
      },
      skip: 10, // Skip the latest 10
      select: { id: true },
    });

    const deleteIds = idsToDelete.map((product) => product.id);

    await prisma.recentProduct.deleteMany({
      where: {
        id: {
          in: deleteIds,
        },
      },
    });
  }

  return {
    meta: {
      total,
    },
    data: recentProducts,
  };
};

const getRecentProductByID = async (req: Request) => {
  const productInfo = await prisma.recentProduct.findUniqueOrThrow({
    where: {
      id: req.body.id,
      product: {
        vendorStand: {
          status: VendorStandStatus.ACTIVE,
          isDeleted: false,
          owner: {
            status: UserStatus.ACTIVE,
            isDeleted: false,
          },
        },
      },
    },
  });

  return { productInfo };
};

const createRecentProduct = async (
  req: Request,
): Promise<RecentProduct & { user: User; product: Product }> => {
  const { userId, productId, viewedAt } = req.body;

  const existingRecentProduct = await prisma.recentProduct.findFirst({
    where: {
      userId,
      productId,
    },
  });

  let result;

  if (existingRecentProduct !== null) {
    result = await prisma.recentProduct.update({
      where: {
        id: existingRecentProduct.id,
      },
      data: {
        viewedAt,
      },
      include: {
        user: true,
        product: true,
      },
    });
  } else {
    result = await prisma.recentProduct.create({
      data: {
        userId,
        productId,
        viewedAt,
      },
      include: {
        user: true,
        product: true,
      },
    });
  }

  return result;
};

const updateRecentProduct = async (id: string, viewedAt: Date) => {
  const existingRecentProduct = await prisma.recentProduct.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const productInfo = await prisma.recentProduct.update({
    where: {
      id: existingRecentProduct.id,
    },
    data: {
      viewedAt,
    },
  });

  return { productInfo };
};

export const recentProductService = {
  getAllRecentProducts,
  getRecentProductByID,
  createRecentProduct,
  updateRecentProduct,
};
