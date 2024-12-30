/*
  Warnings:

  - The `paymentMethod` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" TEXT;

-- DropEnum
DROP TYPE "PaymentMethod";
