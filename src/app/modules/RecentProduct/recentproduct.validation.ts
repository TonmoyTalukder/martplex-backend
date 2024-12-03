import { z } from 'zod';

// Schema for creating a recent product
const createRecentProductSchema = z.object({
  body: z.object({
    userId: z.string().uuid({ message: 'Invalid user ID format.' }),
    productId: z.string().uuid({ message: 'Invalid product ID format.' }),
    viewedAt: z.date({ message: 'Invalid date format for viewedAt.' }),
  }),
});

// Schema for getting a recent product by ID
const getRecentProductByIDSchema = z.object({
  body: z.object({
    id: z.string().uuid({ message: 'Invalid product ID format.' }),
  }),
});

// Schema for updating a recent product
const updateRecentProductSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Invalid product ID format.' }),
  }),
  body: z.object({
    viewedAt: z.date({ message: 'Invalid date format for viewedAt.' }),
  }),
});

export const recentProductValidation = {
  createRecentProductSchema,
  getRecentProductByIDSchema,
  updateRecentProductSchema,
};
