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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const order_constant_1 = require("./order.constant");
const getAllOrders = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: order_constant_1.orderSearchableFields.map((field) => ({
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
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.order.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
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
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
        },
    });
    const total = yield prisma_1.default.order.count({
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
});
const getOrderByID = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const orderInfo = yield prisma_1.default.order.findUniqueOrThrow({
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
});
const createOrder = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, vendorStandId, totalAmount, items, cartId } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Items array is required and cannot be empty.');
    }
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Creating order...');
        const order = yield prisma.order.create({
            data: {
                userId,
                vendorStandId,
                totalAmount,
                status: 'PENDING',
            },
        });
        console.log('Order created:', order);
        console.log('Creating order items...');
        const orderItems = yield Promise.all(items.map((item) => prisma.orderItem.create({
            data: {
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            },
        })));
        console.log('Order items created:', orderItems);
        // Payment service
        console.log('Initiating payment...');
        // await paymentService.createPayment(order.id, vendorStandId, totalAmount);
        const payment = yield prisma.payment.create({
            data: {
                orderId: order.id,
                vendorStandId,
                amount: totalAmount,
                status: client_1.PaymentStatus.PENDING,
            },
        });
        // Delete the cart
        console.log('Deleting cart items...');
        yield prisma.cartItem.deleteMany({
            where: { cartId },
        });
        // await prisma.order.update({
        //   where: { id: order.id },
        //   data: {
        //     paymentId: payment.id,
        //   },
        // });
        console.log('Cart items deleted for cartId:', cartId);
        return Object.assign(Object.assign({}, order), { items: orderItems, payment });
    }));
    return result;
});
const updateOrder = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, totalAmount, status, items } = req.body;
    if (!orderId) {
        throw new Error('Order ID is required.');
    }
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Items array is required and cannot be empty.');
    }
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Update the Order
        const order = yield prisma.order.update({
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
        yield prisma.orderItem.deleteMany({
            where: { orderId },
        });
        // Create new OrderItems
        yield prisma.orderItem.createMany({
            data: items.map((item) => ({
                orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            })),
        });
        // Fetch the newly created OrderItems
        const updatedItems = yield prisma.orderItem.findMany({
            where: { orderId },
        });
        return Object.assign(Object.assign({}, order), { items: updatedItems });
    }));
    return result;
});
const updateOrderStatus = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { orderId, status } = req.body;
    if (!orderId) {
        throw new Error('Order ID is required.');
    }
    // Map the string status to the corresponding OrderStatus enum value
    const statusMap = {
        PENDING: client_1.OrderStatus.PENDING,
        CONFIRMED: client_1.OrderStatus.CONFIRM,
        PROCESSING: client_1.OrderStatus.PROCESSING,
        SHIPPED: client_1.OrderStatus.SHIPPED,
        DELIVERED: client_1.OrderStatus.DELIVERED,
        CANCELED: client_1.OrderStatus.CANCELED,
    };
    const updateStatus = (_a = statusMap[status.toUpperCase()]) !== null && _a !== void 0 ? _a : client_1.OrderStatus.PENDING;
    // Update the Order
    const order = yield prisma_1.default.order.update({
        where: { id: orderId },
        data: {
            status: updateStatus,
        },
        include: {
            items: true,
        },
    });
    return order;
});
const deleteOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!orderId) {
        throw new Error('Order ID is required.');
    }
    // Ensure the order exists
    yield prisma_1.default.order.findUniqueOrThrow({
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
    yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Delete related Payment records
        yield prisma.payment.deleteMany({
            where: { orderId },
        });
        // Delete all related OrderItems
        yield prisma.orderItem.deleteMany({
            where: { orderId },
        });
        // Delete the Order
        yield prisma.order.delete({
            where: { id: orderId },
        });
    }));
    return { message: 'Order deleted successfully.' };
});
const updateOrderItem = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderItemId, quantity } = req.body;
    if (!orderItemId) {
        throw new Error('Order ID is required.');
    }
    const existingOrderItem = yield prisma_1.default.orderItem.findUniqueOrThrow({
        where: {
            id: orderItemId,
        },
    });
    yield prisma_1.default.order.findUniqueOrThrow({
        where: {
            id: existingOrderItem.orderId,
            status: client_1.OrderStatus.PENDING,
        },
        include: {
            items: true,
        },
    });
    yield prisma_1.default.orderItem.update({
        where: { id: orderItemId },
        data: {
            quantity,
        },
    });
    if (existingOrderItem.quantity === 0) {
        // Delete the orderItem
        yield prisma_1.default.orderItem.delete({
            where: { id: orderItemId },
        });
    }
    return { message: 'Order Item updated successfully.' };
});
const deleteOrderItem = (orderItemId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!orderItemId) {
        throw new Error('Order ID is required.');
    }
    const existingOrderItem = yield prisma_1.default.orderItem.findUniqueOrThrow({
        where: {
            id: orderItemId,
        },
    });
    const existingOrder = yield prisma_1.default.order.findUniqueOrThrow({
        where: {
            id: existingOrderItem.orderId,
            status: client_1.OrderStatus.PENDING,
        },
        include: {
            items: true,
        },
    });
    const orderItem = yield prisma_1.default.orderItem.findUniqueOrThrow({
        where: { id: orderItemId },
    });
    yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.orderItem.delete({
            where: { id: orderItemId },
        });
        if (existingOrder.items.length === 0) {
            // Delete the Cart
            yield prisma.order.delete({
                where: { id: existingOrder.id },
            });
        }
    }));
    return { message: 'Order Item deleted successfully.' };
});
exports.orderService = {
    getAllOrders,
    getOrderByID,
    createOrder,
    updateOrder,
    updateOrderStatus,
    updateOrderItem,
    deleteOrder,
    deleteOrderItem,
};
