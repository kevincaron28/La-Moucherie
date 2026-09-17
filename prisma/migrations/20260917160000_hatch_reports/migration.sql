-- Angler-submitted hatch reports. Kept apart from FishingReport because that
-- model is bilingual throughout (the shop writes both languages) while a
-- visitor writes one, and because structured fields can be aggregated later
-- where prose cannot.

CREATE TYPE "HatchIntensity" AS ENUM ('NONE', 'SPARSE', 'STEADY', 'HEAVY');
CREATE TYPE "WaterLevel" AS ENUM ('LOW', 'NORMAL', 'HIGH');
CREATE TYPE "WaterClarity" AS ENUM ('CLEAR', 'STAINED', 'MUDDY');
CREATE TYPE "SkyCondition" AS ENUM ('SUNNY', 'PARTLY_CLOUDY', 'OVERCAST', 'RAIN');

CREATE TABLE "HatchReport" (
  "id" TEXT NOT NULL,
  "anglerName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "locale" TEXT NOT NULL DEFAULT 'fr',
  "waterId" TEXT,
  "waterOther" TEXT,
  "observedOn" TIMESTAMP(3) NOT NULL,
  "hatchId" TEXT,
  "hookSize" INTEGER,
  "species" "FishSpecies",
  "intensity" "HatchIntensity",
  "waterLevel" "WaterLevel",
  "waterClarity" "WaterClarity",
  "sky" "SkyCondition",
  "waterTempC" DOUBLE PRECISION,
  "productId" TEXT,
  "note" TEXT,
  "approved" BOOLEAN NOT NULL DEFAULT false,
  "fromShop" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "HatchReport_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "HatchReport_approved_observedOn_idx" ON "HatchReport"("approved", "observedOn");
-- For the eventual "what has been reported lately" aggregate.
CREATE INDEX "HatchReport_hatchId_observedOn_idx" ON "HatchReport"("hatchId", "observedOn");

ALTER TABLE "HatchReport" ADD CONSTRAINT "HatchReport_waterId_fkey"
  FOREIGN KEY ("waterId") REFERENCES "FishingWater"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "HatchReport" ADD CONSTRAINT "HatchReport_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CASL requires being able to show HOW express consent was obtained, which a
-- bare subscribedAt timestamp cannot answer.
ALTER TABLE "NewsletterSubscriber" ADD COLUMN "consentSource" TEXT NOT NULL DEFAULT 'newsletter_form';
