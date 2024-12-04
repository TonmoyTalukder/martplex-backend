import { Order, OrderItem, OrderStatus, Prisma } from '@prisma/client';
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
    const order = await prisma.order.create({
      data: {
        userId,
        vendorStandId,
        totalAmount,
        status: OrderStatus.PENDING,
      },
    });

    // Create OrderItems individually and collect their results
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

    await prisma.cart.delete({
      where: {
        id: cartId,
      },
    });

    return { ...order, items: orderItems };
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

const deleteOrder = async (orderId: string): Promise<{ message: string }> => {
  if (!orderId) {
    throw new Error('Order ID is required.');
  }

  await prisma.$transaction(async (prisma) => {
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

export const orderService = {
  getAllOrders,
  getOrderByID,
  createOrder,
  updateOrder,
  deleteOrder,
};
