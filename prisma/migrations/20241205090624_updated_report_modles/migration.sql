/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `reportProducts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `reportVendorStands` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `reportProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reportVendorStands` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reportProducts" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reportVendorStands" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reportProducts_userId_key" ON "reportProducts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "reportVendorStands_userId_key" ON "reportVendorStands"("userId");

-- AddForeignKey
ALTER TABLE "reportProducts" ADD CONSTRAINT "reportProducts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportVendorStands" ADD CONSTRAINT "reportVendorStands_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
