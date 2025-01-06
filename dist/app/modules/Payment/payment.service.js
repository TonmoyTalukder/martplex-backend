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
exports.paymentService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const crypto_1 = require("crypto");
const aamarpay_utils_1 = require("../Aamarpay/aamarpay.utils");
const getAllPayments = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondition = [];
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
    const result = yield prisma_1.default.payment.findMany({
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
    });
    const total = yield prisma_1.default.payment.count({
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
const getPaymentByID = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentInfo = yield prisma_1.default.payment.findUniqueOrThrow({
        where: {
            id: req.body.id,
        },
        include: {
            order: true,
            vendorStand: true,
        },
    });
    return { paymentInfo };
});
const createPayment = (orderId, vendorStandId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    // const { orderId, vendorStandId, amount, paymentMethod } = req.body;
    return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Validate the vendor stand
        yield prisma.vendorStand.findUniqueOrThrow({
            where: {
                id: vendorStandId,
                status: client_1.VendorStandStatus.ACTIVE,
                isDeleted: false,
            },
        });
        // Create the payment
        const payment = yield prisma.payment.create({
            data: {
                orderId,
                vendorStandId,
                amount,
                // paymentMethod,
                status: client_1.PaymentStatus.PENDING,
            },
        });
        return payment;
    }));
});
const updatePaymentMethod = (paymentId, paymentMethod, userId, deliveryAddress, deliveryPhone) => __awaiter(void 0, void 0, void 0, function* () {
    if (paymentMethod === 'COD') {
        // COD payment flow
        const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedPayment = yield prisma.payment.update({
                where: { id: paymentId },
                data: { paymentMethod: 'COD' },
            });
            const existingPayment = yield prisma.payment.findUniqueOrThrow({
                where: { id: paymentId },
            });
            yield prisma.order.update({
                where: { id: existingPayment.orderId },
                data: {
                    deliveryAddress,
                    deliveryPhone,
                },
            });
            return updatedPayment;
        }));
        // Generate transaction ID for COD and update payment status
        const transactionId = `TRX_MARTPLEX_${(0, crypto_1.randomUUID)()}_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
        yield exports.paymentService.updatePaymentStatus(paymentId, client_1.PaymentStatus.SUCCESS, transactionId);
        return result;
    }
    else {
        // Online payment flow
        yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedPayment = yield prisma.payment.update({
                where: { id: paymentId },
                data: { paymentMethod: 'Online' },
            });
            const existingPayment = yield prisma.payment.findUniqueOrThrow({
                where: { id: paymentId },
            });
            yield prisma.order.update({
                where: { id: existingPayment.orderId },
                data: {
                    deliveryAddress,
                    deliveryPhone,
                },
            });
            return updatedPayment;
        }));
        // Initiate online payment
        const result = yield exports.paymentService.initiatePayment(paymentId, userId, deliveryAddress);
        return result; // Return initiatePayment results
    }
});
const updatePaymentStatus = (paymentId, newStatus, transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Fetch the payment and related order
        const payment = yield prisma.payment.findUniqueOrThrow({
            where: { id: paymentId },
            include: {
                order: {
                    include: {
                        items: true,
                    },
                },
            },
        });
        let updatedPayment;
        // Update the payment status
        if (newStatus === client_1.PaymentStatus.SUCCESS) {
            updatedPayment = yield prisma.payment.update({
                where: { id: paymentId },
                data: {
                    status: newStatus,
                    transactionId,
                },
            });
        }
        else {
            updatedPayment = yield prisma.payment.update({
                where: { id: paymentId },
                data: { status: newStatus },
            });
        }
        // If the new status is FAILED, restore stock for each product
        if (newStatus === client_1.PaymentStatus.FAILED) {
            for (const item of payment.order.items) {
                yield prisma.product.update({
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
    }));
});
const deleteUnsuccessfulPayment = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Fetch the payment with its order and items
        const payment = yield prisma.payment.findUniqueOrThrow({
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
        if (payment.status === client_1.PaymentStatus.SUCCESS) {
            throw new Error('Payment can only be deleted if status is FAILED or PENDING.');
        }
        // If status is PENDING, restore the stock
        if (payment.status === client_1.PaymentStatus.PENDING) {
            for (const item of payment.order.items) {
                yield prisma.product.update({
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
        yield prisma.payment.delete({
            where: { id: paymentId },
        });
    }));
    return { message: 'Unsuccessful payment deleted successfully.' };
});
const deletePayment = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!paymentId) {
        throw new Error('Payment ID is required.');
    }
    yield prisma_1.default.payment.delete({
        where: { id: paymentId },
    });
    return { message: 'Payment deleted successfully.' };
});
const initiatePayment = (paymentId, userId, deliveryAddress) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the booking
    const payment = yield prisma_1.default.payment.findUniqueOrThrow({
        where: {
            id: paymentId,
        },
    });
    // Find the user
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: userId,
        },
    });
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Fetch and validate the order
        const order = yield prisma.order.findUniqueOrThrow({
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
            yield prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity, // Reduce stock by the order item quantity
                    },
                },
            });
        }
        const transactionId = `TRX_MARTPLEX_${(0, crypto_1.randomUUID)()}_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
        // Create payment data
        const paymentData = {
            transactionId,
            paymentId,
            amount: payment.amount,
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: user.phoneNumber,
            customerAddress: deliveryAddress,
        };
        console.log(paymentData);
        // Initiate the payment
        const paymentSession = yield (0, aamarpay_utils_1.initiateAamarPayment)(paymentData);
        return paymentSession;
    }));
    return result;
});
exports.paymentService = {
    getAllPayments, //
    getPaymentByID, //
    createPayment,
    updatePaymentMethod, //
    updatePaymentStatus,
    deleteUnsuccessfulPayment, //
    deletePayment, //
    initiatePayment, //
};
