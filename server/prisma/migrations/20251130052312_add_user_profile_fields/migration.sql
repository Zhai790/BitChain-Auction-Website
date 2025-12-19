/*
  Warnings:

  - The required column `walletAddress` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bidsTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "walletAddress" TEXT NOT NULL,
ADD COLUMN     "walletBalance" DOUBLE PRECISION NOT NULL DEFAULT 0;
