"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createAdmin = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: 'A valid email is required.' }),
        name: zod_1.z.string().min(1, { message: 'Name is required!' }),
        phoneNumber: zod_1.z.string().min(10, {
            message: 'Phone Number must be at least 10 characters long.',
        }),
        password: zod_1.z
            .string()
            .min(6, { message: 'Password must be at least 6 characters long.' }),
    }),
});
// const updateStatus = z.object({
//     body: z.object({
//         status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED])
//     })
// })
const updateStatus = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.UserStatus, {
            required_error: 'Status is required and must be a valid UserStatus value.',
        }),
    }),
});
const becomeVendor = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.nativeEnum(client_1.UserRole, {
            required_error: 'Role is required and must be a valid UserRole value.',
        }),
    }),
});
exports.userValidation = {
    createAdmin,
    updateStatus,
    becomeVendor,
};
