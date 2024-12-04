import { z } from 'zod';

const getFlashSaleByIDSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'Flash Sale ID is required.',
    }),
  }),
});

const createFlashSaleSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Flash Sale name is required.',
      })
      .min(1, 'Flash Sale name cannot be empty.'),
    description: z
      .string({
        required_error: 'Description is required.',
      })
      .min(1, 'Description cannot be empty.'),
    discount: z
      .number({
        required_error: 'Discount value is required.',
      })
      .positive('Discount must be greater than zero.')
      .max(100, 'Discount cannot exceed 100%.'),
    startsAt: z
      .string({
        required_error: 'Start date is required.',
      })
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid start date format.'),
    endsAt: z
      .string({
        required_error: 'End date is required.',
      })
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid end date format.'),
    coupon: z
      .string()
      .min(1, 'Coupon code cannot be empty if provided.')
      .optional(),
  }),
});

const updateFlashSaleSchema = z.object({
  body: z.object({
    flashSaleId: z.string({
      required_error: 'Flash Sale ID is required.',
    }),
    name: z
      .string()
      .min(1, 'Flash Sale name cannot be empty if provided.')
      .optional(),
    description: z
      .string()
      .min(1, 'Description cannot be empty if provided.')
      .optional(),
    discount: z
      .number()
      .positive('Discount must be greater than zero if provided.')
      .max(100, 'Discount cannot exceed 100% if provided.')
      .optional(),
    startsAt: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid start date format.')
      .optional(),
    endsAt: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid end date format.')
      .optional(),
    coupon: z
      .string()
      .min(1, 'Coupon code cannot be empty if provided.')
      .optional(),
  }),
});

const deleteFlashSaleSchema = z.object({
  body: z.object({
    flashSaleId: z.string({
      required_error: 'Flash Sale ID is required.',
    }),
  }),
});

export const flashSaleValidation = {
  getFlashSaleByIDSchema,
  updateFlashSaleSchema,
  createFlashSaleSchema,
  deleteFlashSaleSchema,
};
