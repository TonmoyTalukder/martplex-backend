import {
  Category,
  Prisma,
  ProductCategory,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import { Request } from 'express';
import { IPaginationOptions } from '../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { categorySearchableFields } from './category.constant';

const getAllCategories = async (params: any, options: IPaginationOptions) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.CategoryWhereInput[] = [
    {
      isDeleted: false,
    },
  ];

  if (searchTerm) {
    andCondition.push({
      OR: categorySearchableFields.map((field) => ({
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

  const whereConditions: Prisma.CategoryWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.category.findMany({
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

  const total = await prisma.category.count({
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

const getCategoryByID = async (req: Request) => {
  const categoryInfo = await prisma.category.findUniqueOrThrow({
    where: {
      id: req.body.id,
      isDeleted: false,
      products: {
        some: {
          product: {
            isDeleted: false,
          },
        },
      },
    },
  });

  return { categoryInfo };
};

const createCategory = async (
  req: Request,
): Promise<Category & { products: ProductCategory[] }> => {
  const { name, description } = req.body;

  const result = await prisma.category.create({
    data: {
      name,
      description,
    },
    include: {
      products: true,
    },
  });

  return result;
};

const updateCategory = async (req: Request) => {
  await prisma.category.findUniqueOrThrow({
    where: {
      id: req.body.id,
      isDeleted: false,
    },
  });

  const payload = req.body;

  const categoryInfo = await prisma.category.update({
    where: {
      id: payload.id,
    },
    data: payload,
  });

  return { categoryInfo };
};

const softDelete = async (id: string) => {
  await prisma.product.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const softDeleteProduct = await prisma.product.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  return softDeleteProduct;
};

export const categoryService = {
  getAllCategories,
  getCategoryByID,
  createCategory,
  updateCategory,
  softDelete,
};
