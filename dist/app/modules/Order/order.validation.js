"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidation = void 0;
const zod_1 = require("zod");
const getOrderByIDSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
const orderItemSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid(),
    quantity: zod_1.z.number().int().positive(),
    price: zod_1.z.number().positive(),
});
const createOrderSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    vendorStandId: zod_1.z.string().uuid(),
    totalAmount: zod_1.z.number().positive(),
    items: zod_1.z.array(orderItemSchema),
});
const updateOrderSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid(),
    status: zod_1.z
        .enum([
        'PENDING',
        'CONFIRM',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELED',
    ])
        .optional(),
    items: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string().uuid(),
        quantity: zod_1.z.number().int().positive(),
        price: zod_1.z.number().positive(),
    }))
        .optional(),
});
const deleteOrderSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid(),
});
const updateOrderItemSchema = zod_1.z.object({
    orderItemId: zod_1.z.string().uuid('Invalid order item ID format.'),
    quantity: zod_1.z.number().min(1, 'Quantity must be at least 1.'),
});
const deleteOrderItemSchema = zod_1.z.object({
    orderItemId: zod_1.z.string().uuid('Invalid order item ID format.'),
});
exports.orderValidation = {
    getOrderByIDSchema,
    createOrderSchema,
    updateOrderSchema,
    deleteOrderSchema,
    updateOrderItemSchema,
    deleteOrderItemSchema,
};
