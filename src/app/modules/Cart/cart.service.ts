import {
  Cart,
  CartItem,
  Order,
  OrderItem,
  OrderStatus,
  Prisma,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import { Request } from 'express';

const getCartByID = async (id: string, req: Request) => {
  // return { message: 'Cart is empty' };
  const cartInfo = await prisma.cart.findUniqueOrThrow({
    where: {
      userId: id,
    },
    include: {
      user: true,
      vendor: true,
      items: true,
    },
  });

  return { cartInfo };
};

const createCart = async (
  req: Request,
): Promise<Cart & { items: CartItem[] }> => {
  const { userId, vendorStandId, items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Items array is required and cannot be empty.');
  }

  const existingCart = await prisma.cart.findFirst({
    where: {
      userId,
    },
    include: {
      items: true,
    },
  });

  const result = await prisma.$transaction(async (prisma) => {
    let cart: any;
    let cartItems;
    ``;
    if (existingCart) {
      await prisma.cart.update({
        where: {
          userId,
        },
        data: {
          vendorId: vendorStandId,
        },
      });

      // Update existing cart by adding new items
      const currentItemIds = existingCart.items.map((item) => item.productId);

      const newItems = items.filter(
        (item: { productId: string }) =>
          !currentItemIds.includes(item.productId),
      );

      // Create new CartItems for the existing cart
      await prisma.cartItem.createMany({
        data: newItems.map(
          (item: {
            productId: string;
            name: string;
            quantity: number;
            price: number;
          }) => ({
            cartId: existingCart.id,
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          }),
        ),
      });

      // Update quantities for existing items
      await Promise.all(
        items
          .filter((item: { productId: string }) =>
            currentItemIds.includes(item.productId),
          )
          .map((item: { productId: string; quantity: number }) =>
            prisma.cartItem.updateMany({
              where: {
                cartId: existingCart.id,
                productId: item.productId,
              },
              data: { quantity: { increment: item.quantity } },
            }),
          ),
      );

      cart = existingCart;
      cartItems = await prisma.cartItem.findMany({
        where: { cartId: existingCart.id },
      });
    } else {
      // Create a new cart if none exists
      cart = await prisma.cart.create({
        data: {
          userId,
          vendorId: vendorStandId,
        },
      });

      // Add items to the new cart
      cartItems = await Promise.all(
        items.map(
          (item: {
            productId: string;
            name: string;
            quantity: number;
            price: number;
          }) =>
            prisma.cartItem.create({
              data: {
                cartId: cart.id,
                productId: item.productId,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              },
            }),
        ),
      );
    }

    return { ...cart, items: cartItems };
  });

  return result;
};

const updateCart = async (
  req: Request,
): Promise<Cart & { items: CartItem[] }> => {
  const { userId, vendorStandId, items } = req.body;

  const existingCart = await prisma.cart.findUniqueOrThrow({
    where: { userId },
  });

  if (!vendorStandId) {
    throw new Error('Vendor Stand ID is required.');
  }

  const result = await prisma.$transaction(async (prisma) => {
    // Update the Cart
    const cart = await prisma.cart.update({
      where: { id: existingCart.id },
      data: { vendorId: vendorStandId },
    });

    // Fetch current CartItems
    const currentItems = await prisma.cartItem.findMany({
      where: { cartId: existingCart.id },
    });

    const currentItemIds = currentItems.map((item) => item.productId);
    const newItems = items.filter(
      (item: CartItem) => !currentItemIds.includes(item.productId),
    );
    const itemsToUpdate = items.filter((item: CartItem) =>
      currentItemIds.includes(item.productId),
    );
    const itemsToDelete = currentItems.filter(
      (item) => !items.find((i: CartItem) => i.productId === item.productId),
    );

    // Create new CartItems
    await prisma.cartItem.createMany({
      data: newItems.map((item: CartItem) => ({
        cartId: existingCart.id,
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    // Update existing CartItems
    await Promise.all(
      itemsToUpdate.map((item: CartItem) =>
        prisma.cartItem.update({
          where: { id: item.id },
          data: { quantity: item.quantity },
        }),
      ),
    );

    // Delete removed CartItems
    await prisma.cartItem.deleteMany({
      where: { id: { in: itemsToDelete.map((item) => item.id) } },
    });

    const updatedItems = await prisma.cartItem.findMany({
      where: { cartId: existingCart.id },
    });

    return { ...cart, items: updatedItems };
  });

  return result;
};

const updateCartItem = async (req: Request): Promise<{ message: string }> => {
  const { cartItemId, quantity } = req.body;

  if (!cartItemId) {
    throw new Error('CartItem ID is required.');
  }
  if (quantity === undefined || quantity < 0) {
    throw new Error('Quantity must be a positive integer or 0.');
  }

  console.log(cartItemId);

  // Fetch the existing CartItem
  const existingCartItem = await prisma.cartItem.findUniqueOrThrow({
    where: { id: cartItemId },
  });

  console.log(existingCartItem);

  if (quantity === 0) {
    // Delete the CartItem if quantity is 0
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
    return { message: 'CartItem deleted successfully due to zero quantity.' };
  }

  // Update the CartItem quantity
  const result = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  return { message: 'CartItem quantity updated successfully.' };
};

const deleteCart = async (cartId: string): Promise<{ message: string }> => {
  if (!cartId) {
    throw new Error('Cart ID is required.');
  }

  await prisma.$transaction(async (prisma) => {
    // Delete all related OrderItems
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });

    // Delete the Order
    await prisma.cart.delete({
      where: { id: cartId },
    });
  });

  return { message: 'Cart deleted successfully.' };
};

const deleteCartItem = async (
  cartItemId: string,
): Promise<{ message: string }> => {
  if (!cartItemId) {
    throw new Error('Cart ID is required.');
  }

  const existingCartItem = await prisma.cartItem.findUniqueOrThrow({
    where: {
      id: cartItemId,
    },
  });

  const existingCart = await prisma.cart.findUniqueOrThrow({
    where: {
      id: existingCartItem.cartId,
    },
    include: {
      items: true,
    },
  });

  await prisma.$transaction(async (prisma) => {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    // if (existingCart.items.length === 1) {
    //   // Delete the Cart
    //   await prisma.cart.update({
    //     where: { id: existingCart.id },
    //     data: { vendorId: '' },
    //   });
    // }
  });

  return { message: 'Cart Items deleted successfully.' };
};

export const cartService = {
  getCartByID,
  createCart,
  updateCart,
  updateCartItem,
  deleteCart,
  deleteCartItem,
};
