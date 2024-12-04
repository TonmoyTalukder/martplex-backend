/*
  Warnings:

  - You are about to drop the column `flashSaleId` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `couponId` on the `flashSales` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "flashSales" DROP CONSTRAINT "flashSales_couponId_fkey";

-- DropIndex
DROP INDEX "coupons_flashSaleId_key";

-- DropIndex
DROP INDEX "flashSales_couponId_key";

-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "flashSaleId";

-- AlterTable
ALTER TABLE "flashSales" DROP COLUMN "couponId",
ADD COLUMN     "coupon" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
