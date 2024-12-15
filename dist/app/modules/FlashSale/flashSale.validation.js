"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flashSaleValidation = void 0;
const zod_1 = require("zod");
const getFlashSaleByIDSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string({
            required_error: 'Flash Sale ID is required.',
        }),
    }),
});
const createFlashSaleSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Flash Sale name is required.',
        })
            .min(1, 'Flash Sale name cannot be empty.'),
        description: zod_1.z
            .string({
            required_error: 'Description is required.',
        })
            .min(1, 'Description cannot be empty.'),
        discount: zod_1.z
            .number({
            required_error: 'Discount value is required.',
        })
            .positive('Discount must be greater than zero.')
            .max(100, 'Discount cannot exceed 100%.'),
        startsAt: zod_1.z
            .string({
            required_error: 'Start date is required.',
        })
            .refine((val) => !isNaN(Date.parse(val)), 'Invalid start date format.'),
        endsAt: zod_1.z
            .string({
            required_error: 'End date is required.',
        })
            .refine((val) => !isNaN(Date.parse(val)), 'Invalid end date format.'),
        coupon: zod_1.z
            .string()
            .min(1, 'Coupon code cannot be empty if provided.')
            .optional(),
    }),
});
const updateFlashSaleSchema = zod_1.z.object({
    body: zod_1.z.object({
        flashSaleId: zod_1.z.string({
            required_error: 'Flash Sale ID is required.',
        }),
        name: zod_1.z
            .string()
            .min(1, 'Flash Sale name cannot be empty if provided.')
            .optional(),
        description: zod_1.z
            .string()
            .min(1, 'Description cannot be empty if provided.')
            .optional(),
        discount: zod_1.z
            .number()
            .positive('Discount must be greater than zero if provided.')
            .max(100, 'Discount cannot exceed 100% if provided.')
            .optional(),
        startsAt: zod_1.z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), 'Invalid start date format.')
            .optional(),
        endsAt: zod_1.z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), 'Invalid end date format.')
            .optional(),
        coupon: zod_1.z
            .string()
            .min(1, 'Coupon code cannot be empty if provided.')
            .optional(),
    }),
});
const deleteFlashSaleSchema = zod_1.z.object({
    body: zod_1.z.object({
        flashSaleId: zod_1.z.string({
            required_error: 'Flash Sale ID is required.',
        }),
    }),
});
exports.flashSaleValidation = {
    getFlashSaleByIDSchema,
    updateFlashSaleSchema,
    createFlashSaleSchema,
    deleteFlashSaleSchema,
};
