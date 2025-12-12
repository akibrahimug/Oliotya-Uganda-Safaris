-- AlterTable
ALTER TABLE "custom_packages" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "package_bundles" ALTER COLUMN "userId" DROP NOT NULL;
