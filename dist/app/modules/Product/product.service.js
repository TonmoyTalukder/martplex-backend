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
exports.productService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const product_constant_1 = require("./product.constant");
const getAllProducts = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondition = [
        {
            isDeleted: false,
            category: {
                isDeleted: false,
            },
        },
    ];
    if (searchTerm) {
        andCondition.push({
            OR: product_constant_1.productSearchableFields.map((field) => ({
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
    const result = yield prisma_1.default.product.findMany({
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
            vendorStand: true,
            category: true,
            orderItems: true,
            reviews: true,
            reportProduct: true,
        },
    });
    const total = yield prisma_1.default.product.count({
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
const getProductByID = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const productInfo = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id: req.body.id,
            isDeleted: false,
            vendorStand: {
                status: client_1.VendorStandStatus.ACTIVE,
                isDeleted: false,
                owner: {
                    status: client_1.UserStatus.ACTIVE,
                    isDeleted: false,
                },
            },
            category: {
                isDeleted: false,
            },
        },
        include: {
            vendorStand: true,
            categories: true,
            orderItems: true,
            reviews: true,
            reportProduct: true,
        },
    });
    return { productInfo };
});
const createProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    console.log(req.files);
    const imageUrls = [];
    if (files && files.length > 0) {
        for (const file of files) {
            const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
            if (uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url) {
                imageUrls.push(uploadToCloudinary.secure_url);
            }
        }
    }
    const { name, description, price, stock, vendorStandId, categoryId } = req.body;
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield prisma.product.create({
            data: {
                name,
                description,
                images: imageUrls,
                price,
                stock,
                vendorStandId,
                categoryId,
            },
            include: {
                vendorStand: true,
                categories: true,
            },
        });
        if (categoryId) {
            try {
                yield prisma.category.findUniqueOrThrow({
                    where: {
                        id: categoryId,
                        isDeleted: false,
                    },
                });
                yield prisma.productCategory.create({
                    data: {
                        productId: product.id,
                        categoryId,
                    },
                });
            }
            catch (error) {
                throw new Error('Invalid categoryId: The specified category does not exist.');
            }
        }
        return product;
    }));
    return result;
});
const updateProduct = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { categoryId } = _a, restPayload = __rest(_a, ["categoryId"]);
    // Validate category ID
    const categoryExists = yield prisma_1.default.category.findFirst({
        where: {
            id: categoryId,
            isDeleted: false,
        },
    });
    if (!categoryExists) {
        return {
            success: false,
            status: 400,
            message: 'Invalid category ID or category is deleted.',
        };
    }
    // Process uploaded files
    const files = req.files;
    const imageUrls = [];
    if (files && files.length > 0) {
        for (const file of files) {
            const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
            if (uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url) {
                imageUrls.push(uploadToCloudinary.secure_url);
            }
        }
    }
    // Include images in payload
    const payload = Object.assign(Object.assign({}, restPayload), { images: imageUrls.length > 0 ? imageUrls : undefined });
    // Update product
    const productInfo = yield prisma_1.default.product.update({
        where: { id },
        data: payload,
    });
    console.log(payload);
    return { productInfo };
});
const softDelete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
            vendorStand: {
                isDeleted: false,
                status: client_1.VendorStandStatus.ACTIVE,
            },
            category: {
                isDeleted: false,
            },
        },
    });
    const softDeleteProduct = yield prisma_1.default.product.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
    return softDeleteProduct;
});
exports.productService = {
    getAllProducts,
    getProductByID,
    createProduct,
    updateProduct,
    softDelete,
};
