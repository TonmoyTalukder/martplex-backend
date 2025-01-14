"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidation = exports.getProductByIDSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, 'Name must have at least 3 characters')
        .max(100, 'Name cannot exceed 100 characters'),
    description: zod_1.z
        .string()
        .max(50000, 'Description cannot exceed 50000 characters')
        .optional(),
    price: zod_1.z
        .number()
        .min(0.01, 'Price must be greater than 0')
        .max(1000000, 'Price cannot exceed 1,000,000'),
    stock: zod_1.z
        .number()
        .int('Stock must be an integer')
        .min(0, 'Stock cannot be negative'),
    vendorStandId: zod_1.z.string().uuid('Invalid vendor stand ID'),
    categoryId: zod_1.z.string().uuid('Invalid category ID'),
    images: zod_1.z
        .array(zod_1.z.string().url('Each image must be a valid URL'))
        .nonempty('At least one image is required')
        .optional(),
});
exports.getProductByIDSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Vendor Stand ID must be a valid UUID'),
});
const updateProductSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, 'Name must have at least 3 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .optional(),
    description: zod_1.z
        .string()
        .max(50000, 'Description cannot exceed 5000 characters')
        .optional(),
    price: zod_1.z.number().optional(),
    stock: zod_1.z
        .number()
        .int('Stock must be an integer')
        .min(0, 'Stock cannot be negative')
        .optional(),
    vendorStandId: zod_1.z.string().uuid('Invalid vendor stand ID').optional(),
    categoryId: zod_1.z.string().uuid('Invalid category ID').optional(),
    onSale: zod_1.z.boolean().optional(),
    discount: zod_1.z.number().optional(),
    images: zod_1.z.array(zod_1.z.string().url('Each image must be a valid URL')).optional(),
});
// export const softDeleteProductSchema = z.object({
//   id: z.string().uuid('Product ID must be a valid UUID'),
// });
exports.productValidation = {
    createProductSchema: exports.createProductSchema,
    getProductByIDSchema: exports.getProductByIDSchema,
    updateProductSchema,
    // softDeleteProductSchema,
};
