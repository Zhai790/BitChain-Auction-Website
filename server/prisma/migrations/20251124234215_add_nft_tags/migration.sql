-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('ART', 'GAMING', 'MUSIC', 'PHOTOGRAPHY', 'VIDEO', 'SPORT');

-- AlterTable
ALTER TABLE "NFT" ADD COLUMN     "tags" "Categories"[];
