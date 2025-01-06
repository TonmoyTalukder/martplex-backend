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
Object.defineProperty(exports, "__esModule", { value: true });
exports.aamarpayServices = void 0;
const path_1 = require("path");
const aamarpay_utils_1 = require("./aamarpay.utils");
const fs_1 = require("fs");
const payment_service_1 = require("../Payment/payment.service");
const client_1 = require("@prisma/client");
const confirmationService = (transactionId, status, paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyResponse = yield (0, aamarpay_utils_1.verifyAamarPayment)(transactionId);
    let message = '';
    if (verifyResponse && verifyResponse.pay_status === 'Successful') {
        yield payment_service_1.paymentService.updatePaymentStatus(paymentId, client_1.PaymentStatus.SUCCESS, transactionId);
        message = 'Successfully Paid!';
    }
    else {
        yield payment_service_1.paymentService.updatePaymentStatus(paymentId, client_1.PaymentStatus.FAILED);
        message = 'Payment Failed!';
    }
    const filePath = (0, path_1.join)(__dirname, '../../../../views/confirmation.html');
    let template = (0, fs_1.readFileSync)(filePath, 'utf-8');
    template = template.replace('{{message}}', message);
    console.log(status);
    return template;
});
exports.aamarpayServices = {
    confirmationService,
};
