-- AlterTable
ALTER TABLE "destinations" ADD COLUMN "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
