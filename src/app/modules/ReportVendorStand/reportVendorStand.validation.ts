import { z } from 'zod';

// Schema for retrieving a report VendorStand by ID
const getReportVendorStandByIDSchema = z.object({
  body: z.object({
    id: z.string().min(1),
  }),
});

// Schema for creating a report VendorStand
const createReportVendorStandSchema = z.object({
  body: z.object({
    content: z.string().min(1),
    userId: z.string().min(1),
    vendorStandId: z.string().min(1),
  }),
});

// Schema for updating a report VendorStand
const updateReportVendorStandSchema = z.object({
  body: z.object({
    reportId: z.string().min(1),
    content: z.string().min(1),
    userId: z.string().min(1),
    vendorStandId: z.string().min(1),
  }),
});

// Schema for deleting a report VendorStand
const deleteReportVendorStandSchema = z.object({
  params: z.object({
    reportId: z.string().min(1),
  }),
});

export const reportVendorStandValidation = {
  getReportVendorStandByIDSchema,
  createReportVendorStandSchema,
  updateReportVendorStandSchema,
  deleteReportVendorStandSchema,
};
