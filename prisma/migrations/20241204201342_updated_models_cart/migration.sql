-- DropIndex
DROP INDEX "cartItems_cartId_idx";

-- CreateIndex
CREATE INDEX "cart_product_idx" ON "cartItems"("cartId", "productId");

-- CreateIndex
CREATE INDEX "carts_createdAt_idx" ON "carts"("createdAt");
