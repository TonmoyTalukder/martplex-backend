-- CreateEnum
CREATE TYPE "VendorStandStatus" AS ENUM ('ACTIVE', 'BLACKLISTED');

-- AlterTable
ALTER TABLE "vendor_stands" ADD COLUMN     "status" "VendorStandStatus" NOT NULL DEFAULT 'ACTIVE';
