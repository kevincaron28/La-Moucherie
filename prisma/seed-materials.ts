// Seeds the material catalogue and every pattern's standard dressing.
//
// Idempotent: re-running it updates names/specs in place rather than
// duplicating, so it is safe against a database that already has recipes.
// Run with `npm run db:seed-materials`.

import { PrismaClient } from "@prisma/client";
import { MATERIALS, RECIPES } from "./fly-recipes";

const prisma = new PrismaClient();

async function main() {
  const idByKey = new Map<string, string>();

  for (const m of MATERIALS) {
    const row = await prisma.material.upsert({
      where: { category_nameEn: { category: m.category, nameEn: m.nameEn } },
      create: { category: m.category, nameEn: m.nameEn, nameFr: m.nameFr },
      update: { nameFr: m.nameFr },
    });
    idByKey.set(m.key, row.id);
  }
  console.log(`Materials: ${idByKey.size} in place.`);

  let written = 0;
  let missing = 0;

  for (const [slug, lines] of Object.entries(RECIPES)) {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!product) {
      console.warn(`  no product for slug "${slug}" — skipped`);
      missing++;
      continue;
    }

    for (const [position, line] of lines.entries()) {
      const materialId = idByKey.get(line.key);
      if (!materialId) throw new Error(`Unknown material key "${line.key}" in ${slug}`);

      await prisma.productMaterial.upsert({
        where: { productId_materialId: { productId: product.id, materialId } },
        create: {
          productId: product.id,
          materialId,
          specFr: line.specFr ?? null,
          specEn: line.specEn ?? null,
          perFlyQty: line.perFlyQty ?? null,
          position,
        },
        update: {
          specFr: line.specFr ?? null,
          specEn: line.specEn ?? null,
          perFlyQty: line.perFlyQty ?? null,
          position,
        },
      });
      written++;
    }
  }

  console.log(`Recipe lines: ${written} written across ${Object.keys(RECIPES).length - missing} patterns.`);
  if (missing) console.warn(`${missing} recipe(s) had no matching product.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
