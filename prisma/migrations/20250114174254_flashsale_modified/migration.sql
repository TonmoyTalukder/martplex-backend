/*
  Warnings:

  - You are about to drop the column `coupon` on the `flashSales` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "flashSales" DROP COLUMN "coupon";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "flashSaleId" TEXT;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_flashSaleId_fkey" FOREIGN KEY ("flashSaleId") REFERENCES "flashSales"("id") ON DELETE SET NULL ON UPDATE CASCADE;
