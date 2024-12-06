-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_vendorStandId_fkey";

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_vendorStandId_fkey" FOREIGN KEY ("vendorStandId") REFERENCES "vendor_stands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
