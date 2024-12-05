/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `replies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `replies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Made the column `productId` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendorStandId` on table `reviews` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_productId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_vendorStandId_fkey";

-- AlterTable
ALTER TABLE "replies" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "orderId" TEXT NOT NULL,
ALTER COLUMN "productId" SET NOT NULL,
ALTER COLUMN "vendorStandId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "replies_userId_key" ON "replies"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_orderId_key" ON "reviews"("orderId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_vendorStandId_fkey" FOREIGN KEY ("vendorStandId") REFERENCES "vendor_stands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
