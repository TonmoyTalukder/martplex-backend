"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewReplyValidation = void 0;
const zod_1 = require("zod");
// Schema for retrieving a review reply by ID
const getReviewReplyByIDSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string().nonempty("Review ID is required."),
    }),
});
// Schema for creating a review
const createReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().nonempty("Content is required."),
        rating: zod_1.z.number().min(1, "Rating must be at least 1.").max(5, "Rating cannot exceed 5."),
        userId: zod_1.z.string().nonempty("User ID is required."),
        productId: zod_1.z.string().optional(),
        vendorStandId: zod_1.z.string().optional(),
        orderId: zod_1.z.string().optional(),
    }),
});
// Schema for creating a reply
const createReplySchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().nonempty("Content is required."),
        userId: zod_1.z.string().nonempty("User ID is required."),
        reviewId: zod_1.z.string().nonempty("Review ID is required."),
    }),
});
// Schema for updating a review
const updateReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        reviewId: zod_1.z.string().nonempty("Review ID is required."),
        content: zod_1.z.string().nonempty("Content is required."),
        rating: zod_1.z.number().min(1, "Rating must be at least 1.").max(5, "Rating cannot exceed 5."),
    }),
});
// Schema for updating a reply
const updateReplySchema = zod_1.z.object({
    body: zod_1.z.object({
        replyId: zod_1.z.string().nonempty("Reply ID is required."),
        content: zod_1.z.string().nonempty("Content is required."),
    }),
});
// Schema for deleting a review
const deleteReviewSchema = zod_1.z.object({
    params: zod_1.z.object({
        reviewId: zod_1.z.string().nonempty("Review ID is required."),
    }),
});
// Schema for deleting a reply
const deleteReplySchema = zod_1.z.object({
    params: zod_1.z.object({
        replyId: zod_1.z.string().nonempty("Reply ID is required."),
    }),
});
exports.reviewReplyValidation = {
    getReviewReplyByIDSchema,
    createReviewSchema,
    createReplySchema,
    updateReviewSchema,
    updateReplySchema,
    deleteReviewSchema,
    deleteReplySchema,
};
