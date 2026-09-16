-- CreateTable
CREATE TABLE "PlannedFly" (
    "id" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "species" "FishSpecies"[] DEFAULT ARRAY[]::"FishSpecies"[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlannedFly_pkey" PRIMARY KEY ("id")
);
