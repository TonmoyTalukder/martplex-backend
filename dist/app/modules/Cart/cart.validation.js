"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartValidation = void 0;
const zod_1 = require("zod");
const getCartByIDSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid cart ID format.'),
});
const createCartSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid user ID format.'),
    vendorStandId: zod_1.z.string().uuid('Invalid vendor stand ID format.'),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string().uuid('Invalid product ID format.'),
        name: zod_1.z.string(),
        price: zod_1.z.number().int().min(1, 'Price must be at least 1'),
        quantity: zod_1.z.number().int().min(1, 'Quantity must be at least 1.'),
    }))
        .min(1, 'Items array must contain at least one item.'),
});
const updateCartSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid user ID format.'),
    vendorStandId: zod_1.z.string().uuid('Invalid vendor stand ID format.'),
    items: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string().optional(), // For existing items
        productId: zod_1.z.string().uuid('Invalid product ID format.'),
        price: zod_1.z.number().int().min(1, 'Price must be at least 1'),
        quantity: zod_1.z.number().int().min(1, 'Quantity must be at least 1.'),
    }))
        .min(1, 'Items array must contain at least one item.'),
});
const updateCartItemSchema = zod_1.z.object({
    cartItemId: zod_1.z.string().uuid('Invalid CartItem ID format.'),
    quantity: zod_1.z
        .number()
        .int('Quantity must be an integer.')
        .min(0, 'Quantity must be 0 or greater.'),
});
const deleteCartSchema = zod_1.z.object({
    cartId: zod_1.z.string().uuid('Invalid cart ID format.'),
});
const deleteCartItemSchema = zod_1.z.object({
    cartItemId: zod_1.z.string().uuid('Invalid cart item ID format.'),
});
exports.cartValidation = {
    getCartByIDSchema,
    createCartSchema,
    updateCartSchema,
    updateCartItemSchema,
    deleteCartSchema,
    deleteCartItemSchema,
};
