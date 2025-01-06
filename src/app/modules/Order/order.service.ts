import {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  Prisma,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import { Request } from 'express';
import { IPaginationOptions } from '../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { orderSearchableFields } from './order.constant';

const getAllOrders = async (params: any, options: IPaginationOptions) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.OrderWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: orderSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.OrderWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.order.findMany({
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
    include: {
      user: true,
      vendorStand: true,
      payment: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const total = await prisma.order.count({
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

const getOrderByID = async (req: Request) => {
  const orderInfo = await prisma.order.findUniqueOrThrow({
    where: {
      id: req.body.id,
    },
    include: {
      user: true,
      vendorStand: true,
      payment: true,
    },
  });

  return { orderInfo };
};

const createOrder = async (
  req: Request,
): Promise<Order & { items: OrderItem[] }> => {
  const { userId, vendorStandId, totalAmount, items, cartId } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Items array is required and cannot be empty.');
  }

  const result = await prisma.$transaction(async (prisma) => {
    console.log('Creating order...');
    const order = await prisma.order.create({
      data: {
        userId,
        vendorStandId,
        totalAmount,
        status: 'PENDING',
      },
    });

    console.log('Order created:', order);

    console.log('Creating order items...');
    const orderItems = await Promise.all(
      items.map(
        (item: { productId: string; quantity: number; price: number }) =>
          prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            },
          }),
      ),
    );

    console.log('Order items created:', orderItems);

    // Payment service
    console.log('Initiating payment...');
    // await paymentService.createPayment(order.id, vendorStandId, totalAmount);

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        vendorStandId,
        amount: totalAmount,
        status: PaymentStatus.PENDING,
      },
    });

    // Delete the cart
    console.log('Deleting cart items...');
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });

    // await prisma.order.update({
    //   where: { id: order.id },
    //   data: {
    //     paymentId: payment.id,
    //   },
    // });

    console.log('Cart items deleted for cartId:', cartId);

    return { ...order, items: orderItems, payment };
  });

  return result;
};

const updateOrder = async (
  req: Request,
): Promise<Order & { items: OrderItem[] }> => {
  const { orderId, totalAmount, status, items } = req.body;

  if (!orderId) {
    throw new Error('Order ID is required.');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Items array is required and cannot be empty.');
  }

  const result = await prisma.$transaction(async (prisma) => {
    // Update the Order
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        totalAmount,
      },
      include: {
        items: true,
      },
    });

    // Delete existing OrderItems for the order
    await prisma.orderItem.deleteMany({
      where: { orderId },
    });

    // Create new OrderItems
    await prisma.orderItem.createMany({
      data: items.map(
        (item: { productId: string; quantity: number; price: number }) => ({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        }),
      ),
    });

    // Fetch the newly created OrderItems
    const updatedItems = await prisma.orderItem.findMany({
      where: { orderId },
    });

    return { ...order, items: updatedItems };
  });

  return result;
};

const updateOrderStatus = async (req: Request): Promise<Order> => {
  const { orderId, status } = req.body;

  if (!orderId) {
    throw new Error('Order ID is required.');
  }

  // Map the string status to the corresponding OrderStatus enum value
  const statusMap: { [key: string]: OrderStatus } = {
    PENDING: OrderStatus.PENDING,
    CONFIRMED: OrderStatus.CONFIRM,
    PROCESSING: OrderStatus.PROCESSING,
    SHIPPED: OrderStatus.SHIPPED,
    DELIVERED: OrderStatus.DELIVERED,
    CANCELED: OrderStatus.CANCELED,
  };

  const updateStatus = statusMap[status.toUpperCase()] ?? OrderStatus.PENDING;

  // Update the Order
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: updateStatus,
    },
    include: {
      items: true,
    },
  });

  return order;
};

const deleteOrder = async (orderId: string): Promise<{ message: string }> => {
  if (!orderId) {
    throw new Error('Order ID is required.');
  }

  // Ensure the order exists
  await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      payment: true, // Include payment information if needed
    },
  });

  await prisma.$transaction(async (prisma) => {
    // Delete related Payment records
    await prisma.payment.deleteMany({
      where: { orderId },
    });

    // Delete all related OrderItems
    await prisma.orderItem.deleteMany({
      where: { orderId },
    });

    // Delete the Order
    await prisma.order.delete({
      where: { id: orderId },
    });
  });

  return { message: 'Order deleted successfully.' };
};

const updateOrderItem = async (req: Request): Promise<{ message: string }> => {
  const { orderItemId, quantity } = req.body;

  if (!orderItemId) {
    throw new Error('Order ID is required.');
  }

  const existingOrderItem = await prisma.orderItem.findUniqueOrThrow({
    where: {
      id: orderItemId,
    },
  });

  await prisma.order.findUniqueOrThrow({
    where: {
      id: existingOrderItem.orderId,
      status: OrderStatus.PENDING,
    },
    include: {
      items: true,
    },
  });

  await prisma.orderItem.update({
    where: { id: orderItemId },
    data: {
      quantity,
    },
  });

  if (existingOrderItem.quantity === 0) {
    // Delete the orderItem
    await prisma.orderItem.delete({
      where: { id: orderItemId },
    });
  }

  return { message: 'Order Item updated successfully.' };
};

const deleteOrderItem = async (
  orderItemId: string,
): Promise<{ message: string }> => {
  if (!orderItemId) {
    throw new Error('Order ID is required.');
  }

  const existingOrderItem = await prisma.orderItem.findUniqueOrThrow({
    where: {
      id: orderItemId,
    },
  });

  const existingOrder = await prisma.order.findUniqueOrThrow({
    where: {
      id: existingOrderItem.orderId,
      status: OrderStatus.PENDING,
    },
    include: {
      items: true,
    },
  });

  const orderItem = await prisma.orderItem.findUniqueOrThrow({
    where: { id: orderItemId },
  });

  await prisma.$transaction(async (prisma) => {
    await prisma.orderItem.delete({
      where: { id: orderItemId },
    });

    if (existingOrder.items.length === 0) {
      // Delete the Cart
      await prisma.order.delete({
        where: { id: existingOrder.id },
      });
    }
  });

  return { message: 'Order Item deleted successfully.' };
};

export const orderService = {
  getAllOrders,
  getOrderByID,
  createOrder,
  updateOrder,
  updateOrderStatus,
  updateOrderItem,
  deleteOrder,
  deleteOrderItem,
};
