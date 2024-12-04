/*
  Warnings:

  - A unique constraint covering the columns `[orderId,productId]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'CONFIRM';

-- DropForeignKey
ALTER TABLE "cartItems" DROP CONSTRAINT "cartItems_cartId_fkey";

-- DropForeignKey
ALTER TABLE "cartItems" DROP CONSTRAINT "cartItems_productId_fkey";

-- DropIndex
DROP INDEX "orders_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "order_items_orderId_productId_key" ON "order_items"("orderId", "productId");

-- AddForeignKey
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
