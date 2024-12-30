import {
  Prisma,
  Payment,
  UserStatus,
  VendorStandStatus,
  PaymentStatus,
  PaymentMethod,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import { Request } from 'express';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../interfaces/pagination';
import { randomUUID } from 'crypto';
import { initiateAamarPayment } from '../Aamarpay/aamarpay.utils';

const getAllPayments = async (params: any, options: IPaginationOptions) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.PaymentWhereInput[] = [];

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.PaymentWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.payment.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getPaymentByID = async (req: Request) => {
  const paymentInfo = await prisma.payment.findUniqueOrThrow({
    where: {
      id: req.body.id,
    },
    include: {
      order: true,
      vendorStand: true,
    },
  });

  return { paymentInfo };
};

const createPayment = async (
  orderId: string,
  vendorStandId: string,
  amount: number,
  // paymentMethod: PaymentMethod,
): Promise<Payment> => {
  // const { orderId, vendorStandId, amount, paymentMethod } = req.body;

  return await prisma.$transaction(async (prisma) => {
    // Validate the vendor stand
    await prisma.vendorStand.findUniqueOrThrow({
      where: {
        id: vendorStandId,
        status: VendorStandStatus.ACTIVE,
        isDeleted: false,
      },
    });

    // Create the payment
    const payment = await prisma.payment.create({
      data: {
        orderId,
        vendorStandId,
        amount,
        // paymentMethod,
        status: PaymentStatus.PENDING,
      },
    });

    return payment;
  });
};

const updatePaymentMethod = async (
  paymentId: string,
  paymentMethod: PaymentMethod,
): Promise<Payment> => {
  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: { paymentMethod: paymentMethod },
  });

  return updatedPayment;
};

const updatePaymentStatus = async (
  paymentId: string,
  newStatus: PaymentStatus,
  transactionId?: string,
): Promise<Payment> => {
  return await prisma.$transaction(async (prisma) => {
    // Fetch the payment and related order
    const payment = await prisma.payment.findUniqueOrThrow({
      where: { id: paymentId },
      include: {
        order: {
          include: {
            items: true,
          },
        },
      },
    });

    let updatedPayment: Payment;

    // Update the payment status
    if (newStatus === PaymentStatus.SUCCESS) {
      updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: newStatus,
          transactionId,
        },
      });
    } else {
      updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: { status: newStatus },
      });
    }

    // If the new status is FAILED, restore stock for each product
    if (newStatus === PaymentStatus.FAILED) {
      for (const item of payment.order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity, // Restore stock
            },
          },
        });
      }
    }

    return updatedPayment;
  });
};

const deleteUnsuccessfulPayment = async (
  paymentId: string,
): Promise<{ message: string }> => {
  await prisma.$transaction(async (prisma) => {
    // Fetch the payment with its order and items
    const payment = await prisma.payment.findUniqueOrThrow({
      where: { id: paymentId },
      include: {
        order: {
          include: {
            items: true, // Fetch order items
          },
        },
      },
    });

    // Ensure the status is either FAILED or PENDING
    if (payment.status === PaymentStatus.SUCCESS) {
      throw new Error(
        'Payment can only be deleted if status is FAILED or PENDING.',
      );
    }

    // If status is PENDING, restore the stock
    if (payment.status === PaymentStatus.PENDING) {
      for (const item of payment.order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity, // Restore stock
            },
          },
        });
      }
    }

    // Delete the payment
    await prisma.payment.delete({
      where: { id: paymentId },
    });
  });

  return { message: 'Unsuccessful payment deleted successfully.' };
};

const deletePayment = async (
  paymentId: string,
): Promise<{ message: string }> => {
  if (!paymentId) {
    throw new Error('Payment ID is required.');
  }

  await prisma.payment.delete({
    where: { id: paymentId },
  });

  return { message: 'Payment deleted successfully.' };
};

const initiatePayment = async (
  paymentId: string,
  userId: string,
  deliveryAddress: string,
): Promise<{ paymentSession: any }> => {
  // Find the booking
  const payment = await prisma.payment.findUniqueOrThrow({
    where: {
      id: paymentId,
    },
  });

  // Find the user
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const result = await prisma.$transaction(async (prisma) => {
    // Fetch and validate the order
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: payment.orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Validate that all items have sufficient stock
    const areQuantitiesValid = order.items.every((item) => {
      return item.quantity <= item.product.stock;
    });

    if (!areQuantitiesValid) {
      throw new Error('One or more items exceed available stock.');
    }

    // Deduct the stock for each product
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity, // Reduce stock by the order item quantity
          },
        },
      });
    }

    const transactionId = `TRX_MARTPLEX_${randomUUID()}_${Date.now()}_${Math.floor(
      Math.random() * 1e6,
    )}`;

    // Create payment data
    const paymentData = {
      transactionId,
      amount: payment.amount,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phoneNumber,
      customerAddress: deliveryAddress,
    };

    console.log(paymentData);

    // Initiate the payment
    const paymentSession = await initiateAamarPayment(paymentData);

    return paymentSession;
  });

  return result;
};

export const paymentService = {
  getAllPayments, //
  getPaymentByID, //
  createPayment,
  updatePaymentMethod, //
  updatePaymentStatus,
  deleteUnsuccessfulPayment, //
  deletePayment, //
  initiatePayment, //
};
