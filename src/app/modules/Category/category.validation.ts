import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, 'Name must have at least 3 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
});

export const getCategoryByIDSchema = z.object({
    id: z.string().uuid('Category ID must be a valid UUID'),
  });
  

const updateCategorySchema = z.object({
  id: z.string().uuid('Invalid category ID').nonempty('Category ID is required'),
  name: z
    .string()
    .min(3, 'Name must have at least 3 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
});

export const softDeleteCategorySchema = z.object({
  id: z.string().uuid('Product ID must be a valid UUID'),
});

export const categoryValidation = {
  createCategorySchema,
  getCategoryByIDSchema,
  updateCategorySchema,
  softDeleteCategorySchema,
};
