"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getCartByID = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const cartInfo = yield prisma_1.default.cart.findUniqueOrThrow({
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
});
const createCart = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, vendorStandId, items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Items array is required and cannot be empty.');
    }
    const existingCart = yield prisma_1.default.cart.findFirst({
        where: {
            userId,
            vendorId: vendorStandId,
        },
        include: {
            items: true,
        },
    });
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        let cart;
        let cartItems;
        ``;
        if (existingCart) {
            // Update existing cart by adding new items
            const currentItemIds = existingCart.items.map((item) => item.productId);
            const newItems = items.filter((item) => !currentItemIds.includes(item.productId));
            // Create new CartItems for the existing cart
            yield prisma.cartItem.createMany({
                data: newItems.map((item) => ({
                    cartId: existingCart.id,
                    productId: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
            });
            // Update quantities for existing items
            yield Promise.all(items
                .filter((item) => currentItemIds.includes(item.productId))
                .map((item) => prisma.cartItem.updateMany({
                where: {
                    cartId: existingCart.id,
                    productId: item.productId,
                },
                data: { quantity: { increment: item.quantity } },
            })));
            cart = existingCart;
            cartItems = yield prisma.cartItem.findMany({
                where: { cartId: existingCart.id },
            });
        }
        else {
            // Create a new cart if none exists
            cart = yield prisma.cart.create({
                data: {
                    userId,
                    vendorId: vendorStandId,
                },
            });
            // Add items to the new cart
            cartItems = yield Promise.all(items.map((item) => prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                },
            })));
        }
        return Object.assign(Object.assign({}, cart), { items: cartItems });
    }));
    return result;
});
const updateCart = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, vendorStandId, items } = req.body;
    const existingCart = yield prisma_1.default.cart.findUniqueOrThrow({
        where: { userId },
    });
    if (!vendorStandId) {
        throw new Error('Vendor Stand ID is required.');
    }
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Update the Cart
        const cart = yield prisma.cart.update({
            where: { id: existingCart.id },
            data: { vendorId: vendorStandId },
        });
        // Fetch current CartItems
        const currentItems = yield prisma.cartItem.findMany({
            where: { cartId: existingCart.id },
        });
        const currentItemIds = currentItems.map((item) => item.productId);
        const newItems = items.filter((item) => !currentItemIds.includes(item.productId));
        const itemsToUpdate = items.filter((item) => currentItemIds.includes(item.productId));
        const itemsToDelete = currentItems.filter((item) => !items.find((i) => i.productId === item.productId));
        // Create new CartItems
        yield prisma.cartItem.createMany({
            data: newItems.map((item) => ({
                cartId: existingCart.id,
                productId: item.productId,
                quantity: item.quantity,
            })),
        });
        // Update existing CartItems
        yield Promise.all(itemsToUpdate.map((item) => prisma.cartItem.update({
            where: { id: item.id },
            data: { quantity: item.quantity },
        })));
        // Delete removed CartItems
        yield prisma.cartItem.deleteMany({
            where: { id: { in: itemsToDelete.map((item) => item.id) } },
        });
        const updatedItems = yield prisma.cartItem.findMany({
            where: { cartId: existingCart.id },
        });
        return Object.assign(Object.assign({}, cart), { items: updatedItems });
    }));
    return result;
});
const updateCartItem = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartItemId, quantity } = req.body;
    if (!cartItemId) {
        throw new Error('CartItem ID is required.');
    }
    if (quantity === undefined || quantity < 0) {
        throw new Error('Quantity must be a positive integer or 0.');
    }
    console.log(cartItemId);
    // Fetch the existing CartItem
    const existingCartItem = yield prisma_1.default.cartItem.findUniqueOrThrow({
        where: { id: cartItemId },
    });
    console.log(existingCartItem);
    if (quantity === 0) {
        // Delete the CartItem if quantity is 0
        yield prisma_1.default.cartItem.delete({
            where: { id: cartItemId },
        });
        return { message: 'CartItem deleted successfully due to zero quantity.' };
    }
    // Update the CartItem quantity
    const result = yield prisma_1.default.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
    });
    return { message: 'CartItem quantity updated successfully.' };
});
const deleteCart = (cartId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!cartId) {
        throw new Error('Cart ID is required.');
    }
    yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Delete all related OrderItems
        yield prisma.cartItem.deleteMany({
            where: { cartId },
        });
        // Delete the Order
        yield prisma.cart.delete({
            where: { id: cartId },
        });
    }));
    return { message: 'Cart deleted successfully.' };
});
const deleteCartItem = (cartItemId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!cartItemId) {
        throw new Error('Cart ID is required.');
    }
    const existingCartItem = yield prisma_1.default.cartItem.findUniqueOrThrow({
        where: {
            id: cartItemId,
        },
    });
    const existingCart = yield prisma_1.default.cart.findUniqueOrThrow({
        where: {
            id: existingCartItem.cartId,
        },
        include: {
            items: true,
        },
    });
    yield prisma_1.default.cartItem.delete({
        where: { id: cartItemId },
    });
    if (existingCart.items.length === 0) {
        // Delete the Cart
        yield prisma_1.default.cart.delete({
            where: { id: existingCart.id },
        });
    }
    return { message: 'Cart Items deleted successfully.' };
});
exports.cartService = {
    getCartByID,
    createCart,
    updateCart,
    updateCartItem,
    deleteCart,
    deleteCartItem,
};
