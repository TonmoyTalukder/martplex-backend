"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportProductValidation = void 0;
const zod_1 = require("zod");
// Schema for retrieving a report product by ID
const getReportProductByIDSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string().min(1),
    }),
});
// Schema for creating a report product
const createReportProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().min(1),
        userId: zod_1.z.string().min(1),
        productId: zod_1.z.string().min(1),
    }),
});
// Schema for updating a report product
const updateReportProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        reportId: zod_1.z.string().min(1),
        content: zod_1.z.string().min(1),
        userId: zod_1.z.string().min(1),
        productId: zod_1.z.string().min(1),
    }),
});
// Schema for deleting a report product
const deleteReportProductSchema = zod_1.z.object({
    params: zod_1.z.object({
        reportId: zod_1.z.string().min(1),
    }),
});
exports.reportProductValidation = {
    getReportProductByIDSchema,
    createReportProductSchema,
    updateReportProductSchema,
    deleteReportProductSchema,
};
