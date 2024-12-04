/*
  Warnings:

  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_reviewId_fkey";

-- AlterTable
ALTER TABLE "coupons" ALTER COLUMN "vendorStandId" DROP NOT NULL;

-- DropTable
DROP TABLE "Cart";

-- DropTable
DROP TABLE "CartItem";

-- DropTable
DROP TABLE "Reply";

-- CreateTable
CREATE TABLE "replies" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reportProducts" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reportProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reportVendorStands" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "vendorStandId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reportVendorStands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartItems" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cartItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "replies_id_key" ON "replies"("id");

-- CreateIndex
CREATE UNIQUE INDEX "replies_reviewId_key" ON "replies"("reviewId");

-- CreateIndex
CREATE INDEX "replies_reviewId_idx" ON "replies"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "reportProducts_id_key" ON "reportProducts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "reportProducts_productId_key" ON "reportProducts"("productId");

-- CreateIndex
CREATE INDEX "reportProducts_productId_idx" ON "reportProducts"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "reportVendorStands_id_key" ON "reportVendorStands"("id");

-- CreateIndex
CREATE UNIQUE INDEX "reportVendorStands_vendorStandId_key" ON "reportVendorStands"("vendorStandId");

-- CreateIndex
CREATE INDEX "reportVendorStands_vendorStandId_idx" ON "reportVendorStands"("vendorStandId");

-- CreateIndex
CREATE UNIQUE INDEX "carts_id_key" ON "carts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "carts_userId_key" ON "carts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "carts_vendorId_key" ON "carts"("vendorId");

-- CreateIndex
CREATE INDEX "carts_userId_idx" ON "carts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "cartItems_id_key" ON "cartItems"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cartItems_cartId_key" ON "cartItems"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "cartItems_productId_key" ON "cartItems"("productId");

-- CreateIndex
CREATE INDEX "cartItems_cartId_idx" ON "cartItems"("cartId");

-- CreateIndex
CREATE INDEX "coupons_vendorStandId_idx" ON "coupons"("vendorStandId");

-- CreateIndex
CREATE INDEX "follows_userId_idx" ON "follows"("userId");

-- CreateIndex
CREATE INDEX "follows_vendorId_idx" ON "follows"("vendorId");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_vendorStandId_idx" ON "orders"("vendorStandId");

-- CreateIndex
CREATE INDEX "payments_vendorStandId_idx" ON "payments"("vendorStandId");

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportProducts" ADD CONSTRAINT "reportProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportVendorStands" ADD CONSTRAINT "reportVendorStands_vendorStandId_fkey" FOREIGN KEY ("vendorStandId") REFERENCES "vendor_stands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_stands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
