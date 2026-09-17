-- Per-fly material lists, so the admin can print a production run sheet with a
-- consolidated shopping list instead of reading 34 recipes by hand.

CREATE TYPE "MaterialCategory" AS ENUM (
  'HOOK', 'BEAD_WEIGHT', 'THREAD', 'TAIL', 'BODY', 'RIB',
  'THORAX', 'HACKLE', 'WING', 'HEAD', 'ADHESIVE', 'OTHER'
);

CREATE TABLE "Material" (
  "id" TEXT NOT NULL,
  "nameFr" TEXT NOT NULL,
  "nameEn" TEXT NOT NULL,
  "category" "MaterialCategory" NOT NULL,
  "supplierNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Material_category_nameEn_key" ON "Material"("category", "nameEn");
CREATE INDEX "Material_category_idx" ON "Material"("category");

CREATE TABLE "ProductMaterial" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "materialId" TEXT NOT NULL,
  "specFr" TEXT,
  "specEn" TEXT,
  "perFlyQty" INTEGER,
  "position" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "ProductMaterial_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductMaterial_productId_materialId_key" ON "ProductMaterial"("productId", "materialId");
CREATE INDEX "ProductMaterial_productId_idx" ON "ProductMaterial"("productId");

ALTER TABLE "ProductMaterial" ADD CONSTRAINT "ProductMaterial_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Restrict: deleting a material still used by a recipe should fail loudly.
ALTER TABLE "ProductMaterial" ADD CONSTRAINT "ProductMaterial_materialId_fkey"
  FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Recipes seed from the standard published dressing, which is a starting point
-- rather than how this bench ties. Off until someone has checked that fly.
ALTER TABLE "Product" ADD COLUMN "materialsPublic" BOOLEAN NOT NULL DEFAULT false;
