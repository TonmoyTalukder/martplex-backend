import {
  Follow,
  Prisma,
  User,
  VendorStand,
  VendorStandStatus,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import { fileUploader } from '../../../helpers/fileUploader';
import { Request } from 'express';
import { IFile } from '../../interfaces/file';
import { IPaginationOptions } from '../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { vendorStandSearchableFields } from './vendorstand.constant';

const getAllVendorStand = async (params: any, options: IPaginationOptions) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.VendorStandWhereInput[] = [
    {
      isDeleted: false,
    },
  ];

  if (searchTerm) {
    andCondition.push({
      OR: vendorStandSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.VendorStandWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.vendorStand.findMany({
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

  const total = await prisma.vendorStand.count({
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

const getVendorStandByID = async (req: Request) => {
  const vendorStandInfo = await prisma.vendorStand.findUniqueOrThrow({
    where: {
      id: req.body.id,
      status: VendorStandStatus.ACTIVE,
      isDeleted: false,
    },
  });

  return { vendorStandInfo };
};

const createVendorStand = async (
  req: Request,
): Promise<VendorStand & { owner: User }> => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.logo = uploadToCloudinary?.secure_url;
  }

  const { name, description, logo, ownerId } = req.body;

  const result = await prisma.vendorStand.create({
    data: {
      name,
      description,
      logo,
      ownerId,
    },
    include: {
      owner: true,
    },
  });

  return result;
};

const updateVendorStand = async (req: Request) => {
  await prisma.vendorStand.findUniqueOrThrow({
    where: {
      id: req.body.id,
      isDeleted: false,
    },
  });

  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.logo = uploadToCloudinary?.secure_url;
  }

  const payload = req.body;

  const vendorStandInfo = await prisma.vendorStand.update({
    where: {
      id: payload.id,
    },
    data: payload,
  });

  return { vendorStandInfo };
};

const blacklistVendorStand = async (id: string, blacklist: string) => {
  const existingVendorStand = await prisma.vendorStand.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  await prisma.user.findUniqueOrThrow({
    where: {
      id: existingVendorStand.ownerId,
      isDeleted: false,
    },
  });

  const blacklistedVendorStand = await prisma.vendorStand.update({
    where: {
      id,
    },
    data: {
      status: blacklist
        ? VendorStandStatus.BLACKLISTED
        : VendorStandStatus.ACTIVE,
    },
  });

  return blacklistedVendorStand;
};

const softDelete = async (id: string) => {
  const existingVendorStand = await prisma.vendorStand.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  await prisma.user.findUniqueOrThrow({
    where: {
      id: existingVendorStand.ownerId,
      isDeleted: false,
    },
  });

  const softDeleteVendorStand = await prisma.vendorStand.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  return softDeleteVendorStand;
};

// Follow VendorStand //
const followVendorStand = async (req: Request): Promise<Follow> => {
  const { userId, vendorId } = req.body;

  const result = await prisma.follow.create({
    data: {
      userId: userId,
      vendorId: vendorId,
    },
  });

  return result;
};

const getVendorStandFollowers = async (req: Request) => {
  const { id } = req.body;
  const allFollowers = await prisma.vendorStand.findUnique({
    where: {
      id,
    },
    include: { followers: { include: { user: true } } },
  });

  return { allFollowers };
};

const getFollowedVendorStands = async (req: Request) => {
  const { id } = req.body;
  const allFollowers = await prisma.user.findUnique({
    where: {
      id,
    },
    include: { follows: { include: { vendor: true } } },
  });

  return { allFollowers };
};

export const vendorStandService = {
  getAllVendorStand,
  getVendorStandByID,
  createVendorStand,
  updateVendorStand,
  blacklistVendorStand,
  softDelete,
  followVendorStand,
  getVendorStandFollowers,
  getFollowedVendorStands,
};
