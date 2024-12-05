import { z } from 'zod';

// Schema for retrieving a review reply by ID
const getReviewReplyByIDSchema = z.object({
  body: z.object({
    id: z.string().nonempty("Review ID is required."),
  }),
});

// Schema for creating a review
const createReviewSchema = z.object({
  body: z.object({
    content: z.string().nonempty("Content is required."),
    rating: z.number().min(1, "Rating must be at least 1.").max(5, "Rating cannot exceed 5."),
    userId: z.string().nonempty("User ID is required."),
    productId: z.string().optional(),
    vendorStandId: z.string().optional(),
    orderId: z.string().optional(),
  }),
});

// Schema for creating a reply
const createReplySchema = z.object({
  body: z.object({
    content: z.string().nonempty("Content is required."),
    userId: z.string().nonempty("User ID is required."),
    reviewId: z.string().nonempty("Review ID is required."),
  }),
});

// Schema for updating a review
const updateReviewSchema = z.object({
  body: z.object({
    reviewId: z.string().nonempty("Review ID is required."),
    content: z.string().nonempty("Content is required."),
    rating: z.number().min(1, "Rating must be at least 1.").max(5, "Rating cannot exceed 5."),
  }),
});

// Schema for updating a reply
const updateReplySchema = z.object({
  body: z.object({
    replyId: z.string().nonempty("Reply ID is required."),
    content: z.string().nonempty("Content is required."),
  }),
});

// Schema for deleting a review
const deleteReviewSchema = z.object({
  params: z.object({
    reviewId: z.string().nonempty("Review ID is required."),
  }),
});

// Schema for deleting a reply
const deleteReplySchema = z.object({
  params: z.object({
    replyId: z.string().nonempty("Reply ID is required."),
  }),
});

export const reviewReplyValidation = {
  getReviewReplyByIDSchema,
  createReviewSchema,
  createReplySchema,
  updateReviewSchema,
  updateReplySchema,
  deleteReviewSchema,
  deleteReplySchema,
};
