import { z } from 'zod';

const getCartByIDSchema = z.object({
  id: z.string().uuid('Invalid cart ID format.'),
});

const createCartSchema = z.object({
  userId: z.string().uuid('Invalid user ID format.'),
  vendorStandId: z.string().uuid('Invalid vendor stand ID format.'),
  items: z
    .array(
      z.object({
        productId: z.string().uuid('Invalid product ID format.'),
        name: z.string(),
        price: z.number().int().min(1, 'Price must be at least 1'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1.'),
      }),
    )
    .min(1, 'Items array must contain at least one item.'),
});

const updateCartSchema = z.object({
  userId: z.string().uuid('Invalid user ID format.'),
  vendorStandId: z.string().uuid('Invalid vendor stand ID format.'),
  items: z
    .array(
      z.object({
        id: z.string().optional(), // For existing items
        productId: z.string().uuid('Invalid product ID format.'),
        price: z.number().int().min(1, 'Price must be at least 1'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1.'),
      }),
    )
    .min(1, 'Items array must contain at least one item.'),
});

const updateCartItemSchema = z.object({
  cartItemId: z.string().uuid('Invalid CartItem ID format.'),
  quantity: z
    .number()
    .int('Quantity must be an integer.')
    .min(0, 'Quantity must be 0 or greater.'),
});

const deleteCartSchema = z.object({
  cartId: z.string().uuid('Invalid cart ID format.'),
});

const deleteCartItemSchema = z.object({
  cartItemId: z.string().uuid('Invalid cart item ID format.'),
});

export const cartValidation = {
  getCartByIDSchema,
  createCartSchema,
  updateCartSchema,
  updateCartItemSchema,
  deleteCartSchema,
  deleteCartItemSchema,
};
