/*
  Warnings:

  - Added the required column `categoryId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[];
