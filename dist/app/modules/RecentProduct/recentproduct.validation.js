"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recentProductValidation = void 0;
const zod_1 = require("zod");
// Schema for creating a recent product
const createRecentProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().uuid({ message: 'Invalid user ID format.' }),
        productId: zod_1.z.string().uuid({ message: 'Invalid product ID format.' }),
        viewedAt: zod_1.z.date({ message: 'Invalid date format for viewedAt.' }),
    }),
});
// Schema for getting a recent product by ID
const getRecentProductByIDSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string().uuid({ message: 'Invalid product ID format.' }),
    }),
});
// Schema for updating a recent product
const updateRecentProductSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid({ message: 'Invalid product ID format.' }),
    }),
    body: zod_1.z.object({
        viewedAt: zod_1.z.date({ message: 'Invalid date format for viewedAt.' }),
    }),
});
exports.recentProductValidation = {
    createRecentProductSchema,
    getRecentProductByIDSchema,
    updateRecentProductSchema,
};
