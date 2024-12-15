import {
  Follow,
  Prisma,
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
import { vendorStandSearchableFields } from './vendorstand.constant';

const getAllVendorStands = async (params: any, options: IPaginationOptions) => {
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
    include: {
      owner: true,
    },
  });

  const sanitizedResult = result.map((vendorStand) => {
    if (vendorStand.owner) {
      delete (vendorStand.owner as { password?: string }).password;
    }
    return vendorStand;
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
    data: sanitizedResult,
  };
};

const getVendorStandByID = async (id: string) => {
  console.log('Vendor Stand ID: ', id);
  const vendorStandInfo = await prisma.vendorStand.findUniqueOrThrow({
    where: {
      id,
      status: VendorStandStatus.ACTIVE,
      isDeleted: false,
      owner: {
        status: UserStatus.ACTIVE,
        isDeleted: false,
      },
    },
    include: {
      owner: true,
    },
  });

  if (vendorStandInfo.owner) {
    delete (vendorStandInfo.owner as { password?: string }).password;
  }

  return { vendorStandInfo };
};

const createVendorStand = async (
  req: Request,
): Promise<VendorStand & { owner: User }> => {
  let logo = undefined;

  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    logo = uploadToCloudinary?.secure_url;
  }

  const { name, description, ownerId } = req.body;

  if (!name || !description || !ownerId) {
    throw new Error('Name, description, and ownerId are required fields.');
  }

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
  getAllVendorStands,
  getVendorStandByID,
  createVendorStand,
  updateVendorStand,
  blacklistVendorStand,
  softDelete,
  followVendorStand,
  getVendorStandFollowers,
  getFollowedVendorStands,
};
