"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/Auth/auth.routes");
const user_routes_1 = require("../modules/User/user.routes");
const vendorstand_route_1 = require("../modules/VendorStand/vendorstand.route");
const product_route_1 = require("../modules/Product/product.route");
const recentproduct_route_1 = require("../modules/RecentProduct/recentproduct.route");
const category_route_1 = require("../modules/Category/category.route");
const order_route_1 = require("../modules/Order/order.route");
const cart_route_1 = require("../modules/Cart/cart.route");
const coupon_route_1 = require("../modules/Coupon/coupon.route");
const flashSale_route_1 = require("../modules/FlashSale/flashSale.route");
const reviewReply_route_1 = require("../modules/ReviewReply/reviewReply.route");
const reportProduct_route_1 = require("../modules/ReportProduct/reportProduct.route");
const reportVendorStand_route_1 = require("../modules/ReportVendorStand/reportVendorStand.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_routes_1.authRoutes,
    },
    {
        path: '/user',
        route: user_routes_1.userRoutes,
    },
    {
        path: '/vendor-stand',
        route: vendorstand_route_1.vendorStandRoutes,
    },
    {
        path: '/product',
        route: product_route_1.productRoutes,
    },
    {
        path: '/recent-product',
        route: recentproduct_route_1.recentProductRoutes,
    },
    {
        path: '/category',
        route: category_route_1.categoryRoutes,
    },
    {
        path: '/order',
        route: order_route_1.orderRoutes,
    },
    {
        path: '/cart',
        route: cart_route_1.cartRoutes,
    },
    {
        path: '/coupon',
        route: coupon_route_1.couponRoutes,
    },
    {
        path: '/flash-sale',
        route: flashSale_route_1.flashSaleRoutes,
    },
    {
        path: '/review',
        route: reviewReply_route_1.reviewReplyRoutes,
    },
    {
        path: '/report/product',
        route: reportProduct_route_1.reportProductRoutes,
    },
    {
        path: '/report/vendor-stand',
        route: reportVendorStand_route_1.reportVendorStandRoutes,
    },
    {
        path: '/payment',
        route: payment_route_1.paymentRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
