import { UserRole, UserStatus } from '@prisma/client';
import { z } from 'zod';

const createAdmin = z.object({
  body: z.object({
    email: z.string().email({ message: 'A valid email is required.' }),
    name: z.string().min(1, { message: 'Name is required!' }),
    phoneNumber: z.string().min(10, {
      message: 'Phone Number must be at least 10 characters long.',
    }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long.' }),
  }),
});

// const updateStatus = z.object({
//     body: z.object({
//         status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED])
//     })
// })

const updateStatus = z.object({
  body: z.object({
    status: z.nativeEnum(UserStatus, {
      required_error:
        'Status is required and must be a valid UserStatus value.',
    }),
  }),
});

const becomeVendor = z.object({
  body: z.object({
    role: z.nativeEnum(UserRole, {
      required_error: 'Role is required and must be a valid UserRole value.',
    }),
  }),
});

export const userValidation = {
  createAdmin,
  updateStatus,
  becomeVendor,
};
