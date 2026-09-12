// Runs as part of `npm run build` on the hosting platform (which has real
// network access to the database, unlike a locked-down dev sandbox). Only
// seeds the catalog on the very first deploy against an empty database —
// never overwrites products/reviews edited later via `npm run db:studio`.
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log(`Database already has ${count} product(s) — skipping seed.`);
    return;
  }
  console.log("Database is empty — running initial seed.");
  execSync("tsx prisma/seed.ts", { stdio: "inherit" });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
