"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportVendorStandValidation = void 0;
const zod_1 = require("zod");
// Schema for retrieving a report VendorStand by ID
const getReportVendorStandByIDSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string().min(1),
    }),
});
// Schema for creating a report VendorStand
const createReportVendorStandSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().min(1),
        userId: zod_1.z.string().min(1),
        vendorStandId: zod_1.z.string().min(1),
    }),
});
// Schema for updating a report VendorStand
const updateReportVendorStandSchema = zod_1.z.object({
    body: zod_1.z.object({
        reportId: zod_1.z.string().min(1),
        content: zod_1.z.string().min(1),
        userId: zod_1.z.string().min(1),
        vendorStandId: zod_1.z.string().min(1),
    }),
});
// Schema for deleting a report VendorStand
const deleteReportVendorStandSchema = zod_1.z.object({
    params: zod_1.z.object({
        reportId: zod_1.z.string().min(1),
    }),
});
exports.reportVendorStandValidation = {
    getReportVendorStandByIDSchema,
    createReportVendorStandSchema,
    updateReportVendorStandSchema,
    deleteReportVendorStandSchema,
};
