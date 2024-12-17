"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidation = exports.softDeleteCategorySchema = exports.getCategoryByIDSchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().optional(), // .min(3, 'Name must have at least 3 characters').max(100, 'Name cannot exceed 100 characters')
    description: zod_1.z.string().optional(),
    //.min(3, 'Name must have at least 3 characters').max(500, 'Description cannot exceed 500 characters')
});
exports.getCategoryByIDSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Category ID must be a valid UUID'),
});
const updateCategorySchema = zod_1.z.object({
    id: zod_1.z
        .string()
        .uuid('Invalid category ID')
        .nonempty('Category ID is required'),
    name: zod_1.z
        .string()
        .min(3, 'Name must have at least 3 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .optional(),
    description: zod_1.z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .optional(),
});
exports.softDeleteCategorySchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Product ID must be a valid UUID'),
});
exports.categoryValidation = {
    createCategorySchema: exports.createCategorySchema,
    getCategoryByIDSchema: exports.getCategoryByIDSchema,
    updateCategorySchema,
    softDeleteCategorySchema: exports.softDeleteCategorySchema,
};
