import { Prisma, User, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import prisma from '../../../shared/prisma';
import { fileUploader } from '../../../helpers/fileUploader';
import { Request } from 'express';
import { IFile } from '../../interfaces/file';
import { IPaginationOptions } from '../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { userSearchableFields } from './user.constant';
import { IAuthUser } from '../../interfaces/common';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';
import config from '../../config';

const createAdmin = async (req: Request): Promise<User> => {
  const { email, name, phoneNumber, password } = req.body;

  if (!email || !name || !phoneNumber || !password) {
    throw new Error(
      'Missing required fields: email, name, phoneNumber, or password.',
    );
  }

  // // Find the user with email and isDeleted=false
  // const user = await prisma.user.findFirst({
  //   where: {
  //     email,
  //     isDeleted: false,
  //   },
  // });

  // if (!user) {
  //   throw new Error('User not found or marked as deleted.');
  // }

  // Hash the password
  const hashedPassword: string = await bcrypt.hash(password, 12);

  // Upsert the user to become an admin
  const result = await prisma.user.upsert({
    where: { email },
    update: {
      role: UserRole.ADMIN,
    },
    create: {
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
      verificationCode: null,
      verificationCodeExpiresAt: null,
    },
  });

  return result;
};

const getAllFromDB = async () => {
  // const { limit, page, skip, sortBy, sortOrder } =
  //   paginationHelper.calculatePagination(options);
  // const { searchTerm, ...filterData } = params;
  // const andCondition: Prisma.UserWhereInput[] = [];

  // if (searchTerm) {
  //   andCondition.push({
  //     OR: userSearchableFields.map((field) => ({
  //       [field]: {
  //         contains: searchTerm,
  //         mode: 'insensitive',
  //       },
  //     })),
  //   });
  // }

  // if (Object.keys(filterData).length > 0) {
  //   andCondition.push({
  //     AND: Object.keys(filterData).map((key) => ({
  //       [key]: {
  //         equals: (filterData as any)[key],
  //       },
  //     })),
  //   });
  // }

  // const whereConditions: Prisma.UserWhereInput =
  //   andCondition.length > 0 ? { AND: andCondition } : {};

  // const role =
  //   whereConditions.role && typeof whereConditions.role === 'string'
  //     ? whereConditions.role
  //     : undefined;

  const result = await prisma.user.findMany();

  // const total = await prisma.user.count({
  //   where: whereConditions,
  // });

  // {
  //   where: whereConditions,
  //   skip,
  //   take: limit,
  //   orderBy:
  //     sortBy && sortOrder
  //       ? {
  //           [sortBy]: sortOrder,
  //         }
  //       : {
  //           createdAt: 'desc',
  //         },
  // }

  return {
    data: result,
  };
};

const changeProfileStatus = async (id: string, status: UserStatus) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};

const becomeVendor = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const updatedUser = await prisma.user.update({
    where: {
      id, // The user ID
    },
    data: {
      role:
        user.role === UserRole.CUSTOMER ? UserRole.VENDOR : UserRole.CUSTOMER,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    updatedUser,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    result: {
      updatedUser,
      accessToken,
    },
  };
};

const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
      isDeleted: false,
    },
  });

  return { userInfo };
};

const getUserProfile = async (id: string) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      status: UserStatus.ACTIVE,
      isDeleted: false,
    },
  });

  const { password, ...userData } = userInfo;

  return { userData };
};

const updateMyProfile = async (user: IAuthUser, req: Request) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: {
        in: [UserStatus.ACTIVE, UserStatus.PENDING_VERIFICATION],
      },
    },
  });

  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const payload = req.body;

  const profileInfo = await prisma.user.update({
    where: {
      email: userInfo.email,
    },
    data: payload,
  });

  return { profileInfo };
};

const blockUser = async (id: string, block: boolean) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const blockedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: block ? UserStatus.BLOCKED : UserStatus.ACTIVE,
    },
  });

  return blockedUser;
};

const softDelete = async (id: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const softDeleteUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      status: UserStatus.DELETED,
    },
  });

  return softDeleteUser;
};

export const userService = {
  createAdmin,
  getAllFromDB,
  changeProfileStatus,
  becomeVendor,
  getMyProfile,
  getUserProfile,
  updateMyProfile,
  blockUser,
  softDelete,
};
