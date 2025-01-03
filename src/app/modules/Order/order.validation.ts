import { z } from 'zod';

const getOrderByIDSchema = z.object({
  id: z.string().uuid(),
});

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

const createOrderSchema = z.object({
  userId: z.string().uuid(),
  vendorStandId: z.string().uuid(),
  totalAmount: z.number().positive(),
  items: z.array(orderItemSchema),
});

const updateOrderSchema = z.object({
  orderId: z.string().uuid(),
  status: z
    .enum([
      'PENDING',
      'CONFIRM',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELED',
    ])
    .optional(),
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      }),
    )
    .optional(),
});

const deleteOrderSchema = z.object({
  orderId: z.string().uuid(),
});

const updateOrderItemSchema = z.object({
  orderItemId: z.string().uuid('Invalid order item ID format.'),
  quantity: z.number().min(1, 'Quantity must be at least 1.'),
});

const deleteOrderItemSchema = z.object({
  orderItemId: z.string().uuid('Invalid order item ID format.'),
});

export const orderValidation = {
  getOrderByIDSchema,
  createOrderSchema,
  updateOrderSchema,
  deleteOrderSchema,
  updateOrderItemSchema,
  deleteOrderItemSchema,
};
