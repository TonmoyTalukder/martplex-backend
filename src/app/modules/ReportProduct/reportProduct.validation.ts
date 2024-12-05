import { z } from 'zod';

// Schema for retrieving a report product by ID
const getReportProductByIDSchema = z.object({
  body: z.object({
    id: z.string().min(1),
  }),
});

// Schema for creating a report product
const createReportProductSchema = z.object({
  body: z.object({
    content: z.string().min(1),
    userId: z.string().min(1),
    productId: z.string().min(1),
  }),
});

// Schema for updating a report product
const updateReportProductSchema = z.object({
  body: z.object({
    reportId: z.string().min(1),
    content: z.string().min(1),
    userId: z.string().min(1),
    productId: z.string().min(1),
  }),
});

// Schema for deleting a report product
const deleteReportProductSchema = z.object({
  params: z.object({
    reportId: z.string().min(1),
  }),
});

export const reportProductValidation = {
  getReportProductByIDSchema,
  createReportProductSchema,
  updateReportProductSchema,
  deleteReportProductSchema,
};
