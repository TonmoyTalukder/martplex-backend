import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must have at least 3 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  description: z
    .string()
    .max(50000, 'Description cannot exceed 50000 characters')
    .optional(),
  price: z
    .number()
    .min(0.01, 'Price must be greater than 0')
    .max(1000000, 'Price cannot exceed 1,000,000'),
  stock: z
    .number()
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),
  vendorStandId: z.string().uuid('Invalid vendor stand ID'),
  categoryId: z.string().uuid('Invalid category ID'),
  images: z
    .array(z.string().url('Each image must be a valid URL'))
    .nonempty('At least one image is required')
    .optional(),
});

export const getProductByIDSchema = z.object({
  id: z.string().uuid('Vendor Stand ID must be a valid UUID'),
});

const updateProductSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must have at least 3 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .optional(),
  description: z
    .string()
    .max(50000, 'Description cannot exceed 5000 characters')
    .optional(),
  price: z.number().optional(),
  stock: z
    .number()
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative')
    .optional(),
  vendorStandId: z.string().uuid('Invalid vendor stand ID').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  onSale: z.boolean().optional(),
  discount: z.number().optional(),
  images: z.array(z.string().url('Each image must be a valid URL')).optional(),
});

// export const softDeleteProductSchema = z.object({
//   id: z.string().uuid('Product ID must be a valid UUID'),
// });

export const productValidation = {
  createProductSchema,
  getProductByIDSchema,
  updateProductSchema,
  // softDeleteProductSchema,
};
