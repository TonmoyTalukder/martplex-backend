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
exports.aamarpayController = void 0;
const aamarpay_service_1 = require("./aamarpay.service");
const confirmationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, status, paymentId } = req.query;
    const result = yield aamarpay_service_1.aamarpayServices.confirmationService(transactionId, status, paymentId);
    res.send(result);
});
exports.aamarpayController = {
    confirmationController,
};
