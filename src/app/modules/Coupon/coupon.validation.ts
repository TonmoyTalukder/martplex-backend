import { z } from 'zod';

const getCouponByIDSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'Coupon ID is required.',
    }),
  }),
});

const createCouponSchema = z.object({
  body: z.object({
    code: z
      .string({
        required_error: 'Coupon code is required.',
      })
      .min(1, 'Coupon code cannot be empty.'),
    discount: z
      .number({
        required_error: 'Discount value is required.',
      })
      .positive('Discount must be greater than zero.')
      .max(100, 'Discount cannot exceed 100%.'),
    expiresAt: z
      .string({
        required_error: 'Expiration date is required.',
      })
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format.'),
    vendorStandId: z.string({
      required_error: 'Vendor Stand ID is required.',
    }),
  }),
});

const updateCouponSchema = z.object({
  body: z.object({
    couponId: z.string({
      required_error: 'Coupon ID is required.',
    }),
    code: z
      .string()
      .min(1, 'Coupon code cannot be empty if provided.')
      .optional(),
    discount: z
      .number()
      .positive('Discount must be greater than zero if provided.')
      .max(100, 'Discount cannot exceed 100% if provided.')
      .optional(),
    expiresAt: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format.')
      .optional(),
  }),
});

const deleteCouponSchema = z.object({
  body: z.object({
    couponId: z.string({
      required_error: 'Coupon ID is required.',
    }),
  }),
});

export const couponValidation = {
  getCouponByIDSchema,
  updateCouponSchema,
  createCouponSchema,
  deleteCouponSchema,
};
