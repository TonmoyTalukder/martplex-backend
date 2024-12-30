import { z } from 'zod';

// Schema for getting payment by ID
const getPaymentByIDSchema = z.object({
  body: z.object({
    id: z.string().uuid(),
  }),
});

// Schema for updating payment method
const updatePaymentMethodSchema = z.object({
  paymentId: z.string().uuid(),
  paymentMethod: z.string(),
  userId: z.string(),
  deliveryAddress: z.string(),
  deliveryPhone: z.string(),
});

// Schema for deleting an unsuccessful payment
const deleteUnsuccessfulPaymentSchema = z.object({
  paymentId: z.string().uuid(),
});

// Schema for deleting a payment
const deletePaymentSchema = z.object({
  paymentId: z.string().uuid(),
});

// Schema for initiating a payment
const initiatePaymentSchema = z.object({
  paymentId: z.string().uuid(),
  userId: z.string().uuid(),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
});

export const paymentValidation = {
  getPaymentByIDSchema,
  updatePaymentMethodSchema,
  deleteUnsuccessfulPaymentSchema,
  deletePaymentSchema,
  initiatePaymentSchema,
};
