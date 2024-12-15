"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorStandValidation = exports.getFollowedVendorStandsSchema = exports.getVendorStandFollowersSchema = exports.followVendorStandSchema = exports.softDeleteVendorStandSchema = exports.blacklistVendorStandSchema = exports.updateVendorStandSchema = exports.getVendorStandByIDSchema = exports.createVendorStandSchema = void 0;
const zod_1 = require("zod");
exports.createVendorStandSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, 'Name must have at least 3 characters')
        .max(100, 'Name cannot exceed 100 characters'),
    description: zod_1.z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .optional(),
    logo: zod_1.z.string().url('Logo must be a valid URL').optional(),
    ownerId: zod_1.z.string().uuid('Owner ID must be a valid UUID'),
});
exports.getVendorStandByIDSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Vendor Stand ID must be a valid UUID'),
});
exports.updateVendorStandSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Vendor Stand ID must be a valid UUID'),
    name: zod_1.z
        .string()
        .min(3, 'Name must have at least 3 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .optional(),
    description: zod_1.z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .optional(),
    logo: zod_1.z.string().url('Logo must be a valid URL').optional(),
    status: zod_1.z
        .enum(['ACTIVE', 'INACTIVE', 'BLACKLISTED', 'PENDING'])
        .optional(),
});
exports.blacklistVendorStandSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Vendor Stand ID must be a valid UUID'),
    blacklist: zod_1.z.boolean(),
});
exports.softDeleteVendorStandSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Vendor Stand ID must be a valid UUID'),
});
exports.followVendorStandSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('User ID must be a valid UUID'),
    vendorId: zod_1.z.string().uuid('Vendor Stand ID must be a valid UUID'),
});
exports.getVendorStandFollowersSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Vendor Stand ID must be a valid UUID'),
});
exports.getFollowedVendorStandsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('User ID must be a valid UUID'),
});
// export type CreateVendorStandInput = z.infer<typeof createVendorStandSchema>;
exports.vendorStandValidation = {
    createVendorStandSchema: exports.createVendorStandSchema,
    getVendorStandByIDSchema: exports.getVendorStandByIDSchema,
    updateVendorStandSchema: exports.updateVendorStandSchema,
    blacklistVendorStandSchema: exports.blacklistVendorStandSchema,
    softDeleteVendorStandSchema: exports.softDeleteVendorStandSchema,
    followVendorStandSchema: exports.followVendorStandSchema,
    getVendorStandFollowersSchema: exports.getVendorStandFollowersSchema,
    getFollowedVendorStandsSchema: exports.getFollowedVendorStandsSchema,
};
