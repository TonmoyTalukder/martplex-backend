"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
// Schema for getting payment by ID
const getPaymentByIDSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
});
// Schema for updating payment method
const updatePaymentMethodSchema = zod_1.z.object({
    paymentId: zod_1.z.string().uuid(),
    paymentMethod: zod_1.z.nativeEnum(client_1.PaymentMethod),
});
// Schema for deleting an unsuccessful payment
const deleteUnsuccessfulPaymentSchema = zod_1.z.object({
    paymentId: zod_1.z.string().uuid(),
});
// Schema for deleting a payment
const deletePaymentSchema = zod_1.z.object({
    paymentId: zod_1.z.string().uuid(),
});
// Schema for initiating a payment
const initiatePaymentSchema = zod_1.z.object({
    paymentId: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    deliveryAddress: zod_1.z.string().min(1, 'Delivery address is required'),
});
exports.paymentValidation = {
    getPaymentByIDSchema,
    updatePaymentMethodSchema,
    deleteUnsuccessfulPaymentSchema,
    deletePaymentSchema,
    initiatePaymentSchema,
};
