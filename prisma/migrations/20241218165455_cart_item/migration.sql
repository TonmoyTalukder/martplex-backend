/*
  Warnings:

  - Added the required column `price` to the `cartItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cartItems" ADD COLUMN     "price" INTEGER NOT NULL;
