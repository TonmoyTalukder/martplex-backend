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
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = __importDefault(require("./prisma"));
const deleteOldCarts = () => __awaiter(void 0, void 0, void 0, function* () {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return yield prisma_1.default.cart.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } },
    });
});
const deleteExpiredCoupons = () => __awaiter(void 0, void 0, void 0, function* () {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return yield prisma_1.default.coupon.deleteMany({
        where: { expiresAt: { lt: thirtyDaysAgo } },
    });
});
const updateFlashSaleStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    // Update FlashSales: Disable sales that haven't started and enable the ones that have started
    const flashSalesToUpdate = yield prisma_1.default.flashSale.findMany({
        where: {
            OR: [
                { startsAt: { gt: currentDate }, isActive: true },
                { endsAt: { lt: currentDate }, isActive: true },
            ],
        },
    });
    const flashSaleUpdates = flashSalesToUpdate.map((flashSale) => {
        let updateData = {};
        if (flashSale.startsAt > currentDate) {
            updateData.isActive = false; // Set to inactive if the sale hasn't started
        }
        if (flashSale.endsAt < currentDate) {
            updateData.isActive = false; // Set to inactive if the sale has ended
        }
        return prisma_1.default.flashSale.update({
            where: { id: flashSale.id },
            data: updateData,
        });
    });
    yield Promise.all(flashSaleUpdates);
});
function withRetries(task_1) {
    return __awaiter(this, arguments, void 0, function* (task, retries = 3) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return yield task();
            }
            catch (error) {
                if (attempt === retries)
                    throw error;
                console.warn(`Retry ${attempt} failed, retrying...`);
            }
        }
    });
}
node_cron_1.default.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date().toISOString();
    console.log(`[${now}] Starting scheduled cleanup task...`);
    try {
        // Delete old carts
        yield withRetries(() => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield deleteOldCarts();
            console.log(`${result.count} carts older than 30 days have been deleted.`);
        }));
        // Delete expired coupons
        yield withRetries(() => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield deleteExpiredCoupons();
            console.log(`${result.count} expired coupons have been deleted.`);
        }));
        // Update flash sale status
        yield withRetries(() => __awaiter(void 0, void 0, void 0, function* () {
            yield updateFlashSaleStatus();
            console.log('FlashSale status updated successfully.');
        }));
    }
    catch (error) {
        console.error('Error deleting junks:', error);
    }
}));
