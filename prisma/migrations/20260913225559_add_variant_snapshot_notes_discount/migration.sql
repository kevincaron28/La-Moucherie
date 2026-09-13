-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discountCents" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "variantSnapshotEn" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "variantSnapshotFr" TEXT NOT NULL DEFAULT '';

