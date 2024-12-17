import { z } from 'zod';

export const createVendorStandSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must have at least 3 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  logo: z.string().url('Logo must be a valid URL').optional(),
  ownerId: z.string().uuid('Owner ID must be a valid UUID'),
});

export const getVendorStandByIDSchema = z.object({
  id: z.string().uuid('Vendor Stand ID must be a valid UUID').optional(),
});

// export const updateVendorStandSchema = z.object({
//   // id: z.string().uuid('Vendor Stand ID must be a valid UUID'),
//   name: z
//     .string()
//     .min(3, 'Name must have at least 3 characters')
//     .max(100, 'Name cannot exceed 100 characters')
//     .optional(),
//   description: z
//     .string()
//     .max(500, 'Description cannot exceed 500 characters')
//     .optional(),
//   logo: z.string().url('Logo must be a valid URL').optional(),
//   status: z.enum(['ACTIVE', 'INACTIVE', 'BLACKLISTED', 'PENDING']).optional(),
// });

export const blacklistVendorStandSchema = z.object({
  id: z.string().uuid('Vendor Stand ID must be a valid UUID'),
  blacklist: z.boolean(),
});

// export const softDeleteVendorStandSchema = z.object({
//   id: z.string().uuid('Vendor Stand ID must be a valid UUID'),
// });

export const followVendorStandSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
  vendorId: z.string().uuid('Vendor Stand ID must be a valid UUID'),
});

export const getVendorStandFollowersSchema = z.object({
  id: z.string().uuid('Vendor Stand ID must be a valid UUID'),
});

export const getFollowedVendorStandsSchema = z.object({
  id: z.string().uuid('User ID must be a valid UUID'),
});

// export type CreateVendorStandInput = z.infer<typeof createVendorStandSchema>;

export const vendorStandValidation = {
  createVendorStandSchema,
  getVendorStandByIDSchema,
  // updateVendorStandSchema,
  blacklistVendorStandSchema,
  // softDeleteVendorStandSchema,
  followVendorStandSchema,
  getVendorStandFollowersSchema,
  getFollowedVendorStandsSchema,
};
