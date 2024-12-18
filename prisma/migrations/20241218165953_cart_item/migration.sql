/*
  Warnings:

  - Added the required column `name` to the `cartItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cartItems_cartId_key";

-- AlterTable
ALTER TABLE "cartItems" ADD COLUMN     "name" TEXT NOT NULL;
