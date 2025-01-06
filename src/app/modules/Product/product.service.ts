import {
  Prisma,
  Product,
  User,
  UserStatus,
  VendorStand,
  VendorStandStatus,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import { fileUploader } from '../../../helpers/fileUploader';
import { Request } from 'express';
import { IFile } from '../../interfaces/file';
import { IPaginationOptions } from '../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { productSearchableFields } from './product.constant';

const getAllProducts = async (params: any, options: IPaginationOptions) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.ProductWhereInput[] = [
    {
      isDeleted: false,
      category: {
        isDeleted: false,
      },
    },
  ];

  if (searchTerm) {
    andCondition.push({
      OR: productSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.ProductWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.product.findMany({
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
    include: {
      vendorStand: true,
      category: true,
      orderItems: true,
      reviews: true,
      reportProduct: true,
    },
  });

  const total = await prisma.product.count({
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

const getProductByID = async (id: string) => {
  const productInfo = await prisma.product.findUniqueOrThrow({
    where: {
      id: id,
      isDeleted: false,
      vendorStand: {
        status: VendorStandStatus.ACTIVE,
        isDeleted: false,
        owner: {
          status: UserStatus.ACTIVE,
          isDeleted: false,
        },
      },
      category: {
        isDeleted: false,
      },
    },
    include: {
      vendorStand: true,
      category: true,
      orderItems: {
        include: {
          order: true,
        },
      },
      reviews: {
        include: {
          user: true, 
          reply: {
            include: {
              user: true, 
            },
          },
        },
      },
      reportProduct: true,
    },
  });

  return { productInfo };
};

const createProduct = async (
  req: Request,
): Promise<Product & { vendorStand: VendorStand }> => {
  const files = req.files as IFile[];

  console.log(req.files);

  const imageUrls: string[] = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
      if (uploadToCloudinary?.secure_url) {
        imageUrls.push(uploadToCloudinary.secure_url);
      }
    }
  }

  const { name, description, price, stock, vendorStandId, categoryId } =
    req.body;

  const result = await prisma.$transaction(async (prisma) => {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        images: imageUrls,
        price,
        stock,
        vendorStandId,
        categoryId,
      },
      include: {
        vendorStand: true,
        categories: true,
      },
    });

    if (categoryId) {
      try {
        await prisma.category.findUniqueOrThrow({
          where: {
            id: categoryId,
            isDeleted: false,
          },
        });

        await prisma.productCategory.create({
          data: {
            productId: product.id,
            categoryId,
          },
        });
      } catch (error) {
        throw new Error(
          'Invalid categoryId: The specified category does not exist.',
        );
      }
    }

    return product;
  });

  return result;
};

const updateProduct = async (id: string, req: Request) => {
  const { categoryId, ...restPayload } = req.body;

  // Validate category ID
  const categoryExists = await prisma.category.findFirst({
    where: {
      id: categoryId,
      isDeleted: false,
    },
  });

  if (!categoryExists) {
    return {
      success: false,
      status: 400,
      message: 'Invalid category ID or category is deleted.',
    };
  }

  // Process uploaded files
  const files = req.files as IFile[];
  const imageUrls: string[] = [];

  if (files && files.length > 0) {
    for (const file of files) {
      const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
      if (uploadToCloudinary?.secure_url) {
        imageUrls.push(uploadToCloudinary.secure_url);
      }
    }
  }

  // Construct payload
  const payload: any = {
    ...restPayload, // Include the rest of the payload
    categoryId, // Explicitly include categoryId
    images: imageUrls.length > 0 ? imageUrls : undefined, // Add images if available
  };

  console.log('Constructed Payload:', payload);

  // Update product
  const productInfo = await prisma.product.update({
    where: { id },
    data: payload,
  });

  return { productInfo };
};

const softDelete = async (id: string) => {
  await prisma.product.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
      vendorStand: {
        isDeleted: false,
        status: VendorStandStatus.ACTIVE,
      },
      category: {
        isDeleted: false,
      },
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

export const productService = {
  getAllProducts,
  getProductByID,
  createProduct,
  updateProduct,
  softDelete,
};
