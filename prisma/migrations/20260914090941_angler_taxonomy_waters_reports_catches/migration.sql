-- CreateEnum
CREATE TYPE "FishSpecies" AS ENUM ('BROOK_TROUT', 'BROWN_TROUT', 'RAINBOW_TROUT', 'LANDLOCKED_SALMON', 'ATLANTIC_SALMON', 'SMALLMOUTH_BASS', 'LARGEMOUTH_BASS', 'NORTHERN_PIKE', 'WALLEYE');

-- CreateEnum
CREATE TYPE "FishingSeason" AS ENUM ('SPRING', 'SUMMER', 'FALL');

-- CreateEnum
CREATE TYPE "WaterType" AS ENUM ('RIVER', 'STREAM', 'LAKE', 'STILLWATER');

-- CreateEnum
CREATE TYPE "Technique" AS ENUM ('DEAD_DRIFT', 'STRIP', 'SWING', 'SKATE', 'NYMPHING', 'TROLLING');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "howToFishEn" TEXT,
ADD COLUMN     "howToFishFr" TEXT,
ADD COLUMN     "imitatesEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "imitatesFr" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "proTipEn" TEXT,
ADD COLUMN     "proTipFr" TEXT,
ADD COLUMN     "seasons" "FishingSeason"[] DEFAULT ARRAY[]::"FishingSeason"[],
ADD COLUMN     "species" "FishSpecies"[] DEFAULT ARRAY[]::"FishSpecies"[],
ADD COLUMN     "techniques" "Technique"[] DEFAULT ARRAY[]::"Technique"[],
ADD COLUMN     "waterTypes" "WaterType"[] DEFAULT ARRAY[]::"WaterType"[];

-- CreateTable
CREATE TABLE "FishingWater" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "regionFr" TEXT NOT NULL,
    "regionEn" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FishingWater_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FishingReport" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "bodyFr" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "conditionsFr" TEXT NOT NULL,
    "conditionsEn" TEXT NOT NULL,
    "waterId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FishingReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatchPhoto" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "anglerName" TEXT NOT NULL,
    "captionFr" TEXT,
    "captionEn" TEXT,
    "species" "FishSpecies",
    "waterId" TEXT,
    "productId" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CatchPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductWaters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductWaters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ReportProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ReportProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "FishingWater_slug_key" ON "FishingWater"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FishingReport_slug_key" ON "FishingReport"("slug");

-- CreateIndex
CREATE INDEX "FishingReport_published_publishedAt_idx" ON "FishingReport"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "CatchPhoto_approved_createdAt_idx" ON "CatchPhoto"("approved", "createdAt");

-- CreateIndex
CREATE INDEX "_ProductWaters_B_index" ON "_ProductWaters"("B");

-- CreateIndex
CREATE INDEX "_ReportProducts_B_index" ON "_ReportProducts"("B");

-- AddForeignKey
ALTER TABLE "FishingReport" ADD CONSTRAINT "FishingReport_waterId_fkey" FOREIGN KEY ("waterId") REFERENCES "FishingWater"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatchPhoto" ADD CONSTRAINT "CatchPhoto_waterId_fkey" FOREIGN KEY ("waterId") REFERENCES "FishingWater"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatchPhoto" ADD CONSTRAINT "CatchPhoto_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductWaters" ADD CONSTRAINT "_ProductWaters_A_fkey" FOREIGN KEY ("A") REFERENCES "FishingWater"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductWaters" ADD CONSTRAINT "_ProductWaters_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportProducts" ADD CONSTRAINT "_ReportProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "FishingReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportProducts" ADD CONSTRAINT "_ReportProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

