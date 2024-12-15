"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponValidation = void 0;
const zod_1 = require("zod");
const getCouponByIDSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string({
            required_error: 'Coupon ID is required.',
        }),
    }),
});
const createCouponSchema = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z
            .string({
            required_error: 'Coupon code is required.',
        })
            .min(1, 'Coupon code cannot be empty.'),
        discount: zod_1.z
            .number({
            required_error: 'Discount value is required.',
        })
            .positive('Discount must be greater than zero.')
            .max(100, 'Discount cannot exceed 100%.'),
        expiresAt: zod_1.z
            .string({
            required_error: 'Expiration date is required.',
        })
            .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format.'),
        vendorStandId: zod_1.z.string({
            required_error: 'Vendor Stand ID is required.',
        }),
    }),
});
const updateCouponSchema = zod_1.z.object({
    body: zod_1.z.object({
        couponId: zod_1.z.string({
            required_error: 'Coupon ID is required.',
        }),
        code: zod_1.z
            .string()
            .min(1, 'Coupon code cannot be empty if provided.')
            .optional(),
        discount: zod_1.z
            .number()
            .positive('Discount must be greater than zero if provided.')
            .max(100, 'Discount cannot exceed 100% if provided.')
            .optional(),
        expiresAt: zod_1.z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format.')
            .optional(),
    }),
});
const deleteCouponSchema = zod_1.z.object({
    body: zod_1.z.object({
        couponId: zod_1.z.string({
            required_error: 'Coupon ID is required.',
        }),
    }),
});
exports.couponValidation = {
    getCouponByIDSchema,
    updateCouponSchema,
    createCouponSchema,
    deleteCouponSchema,
};
