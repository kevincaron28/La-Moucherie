import { PrismaClient, ProductCategory } from "@prisma/client";

const prisma = new PrismaClient();

type VariantSeed = {
  nameFr: string;
  nameEn: string;
  sku: string;
  priceCents?: number;
  stock: number;
};

type ProductSeed = {
  slug: string;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  category: ProductCategory;
  basePriceCents: number;
  images: string[];
  featured?: boolean;
  variants: VariantSeed[];
};

// This is the real starting catalog (as of the patterns confirmed so far) — six
// patterns, category and target species taken from the packaging. Descriptions
// are written from general fly-fishing knowledge of these well-known patterns.
// Hook sizes, exact pricing, and photos are placeholders until confirmed —
// real product photos are coming once the lightbox is built.
const products: ProductSeed[] = [
  {
    slug: "egg-sucking-leech",
    nameFr: "Egg Sucking Leech",
    nameEn: "Egg Sucking Leech",
    descriptionFr:
      "Un patron de sangsue noire terminé par un œuf coloré à la tête — redoutable pendant et après le frai, quand la truite chasse les œufs à la dérive. À pêcher en dérive naturelle ou en tirées lentes dans les fosses profondes.",
    descriptionEn:
      "A black leech pattern trailing a bright egg at the head — deadly during and after the spawn, when trout key in on drifting eggs. Fish it dead-drift or with a slow strip through deeper runs and pools.",
    category: ProductCategory.WET_FLY,
    basePriceCents: 425,
    images: ["/products/placeholder-fly.svg"],
    featured: true,
    variants: [
      { nameFr: "Hameçon #4", nameEn: "Hook #4", sku: "ESL-BLK-04", stock: 18 },
      { nameFr: "Hameçon #6", nameEn: "Hook #6", sku: "ESL-BLK-06", stock: 24 },
      { nameFr: "Hameçon #8", nameEn: "Hook #8", sku: "ESL-BLK-08", stock: 20 },
    ],
  },
  {
    slug: "montana-stone",
    nameFr: "Montana Stone",
    nameEn: "Montana Stone",
    descriptionFr:
      "Une nymphe de perle fortement lestée, imitant les larves de plécoptères recherchées par la truite dans les rivières à fond rocheux. Son corps rayé noir et jaune coule rapidement — une mouche de tête fiable pour pêcher au fond dans les eaux vives.",
    descriptionEn:
      "A heavily-weighted stonefly nymph imitating the large naiads trout key on in freestone rivers. Its black-and-yellow banded body gets down fast — a reliable point fly for bouncing bottom in fast, rocky water.",
    category: ProductCategory.NYMPH,
    basePriceCents: 375,
    images: ["/products/placeholder-fly.svg"],
    featured: true,
    variants: [
      { nameFr: "Hameçon #6", nameEn: "Hook #6", sku: "MTS-STD-06", stock: 22 },
      { nameFr: "Hameçon #8", nameEn: "Hook #8", sku: "MTS-STD-08", stock: 28 },
      { nameFr: "Hameçon #10", nameEn: "Hook #10", sku: "MTS-STD-10", stock: 20 },
    ],
  },
  {
    slug: "elk-wing-caddis",
    nameFr: "Elk Wing Caddis",
    nameEn: "Elk Wing Caddis",
    descriptionFr:
      "Une mouche sèche flottant haut, avec une aile en poil de wapiti qui résiste bien aux courants agités durant les éclosions de trichoptères. Un patron passe-partout du printemps à l'automne sur les rivières à fond rocheux.",
    descriptionEn:
      "A high-floating dry fly with a buoyant elk-hair wing, built to ride out choppy runs during caddis hatches. A go-to searching pattern from spring through fall on freestone water.",
    category: ProductCategory.DRY_FLY,
    basePriceCents: 350,
    images: ["/products/placeholder-fly.svg"],
    featured: true,
    variants: [
      { nameFr: "Hameçon #12", nameEn: "Hook #12", sku: "EWC-STD-12", stock: 32 },
      { nameFr: "Hameçon #14", nameEn: "Hook #14", sku: "EWC-STD-14", stock: 40 },
      { nameFr: "Hameçon #16", nameEn: "Hook #16", sku: "EWC-STD-16", stock: 26 },
    ],
  },
  {
    slug: "lefty-deceiver",
    nameFr: "Lefty Deceiver",
    nameEn: "Lefty Deceiver",
    descriptionFr:
      "Le streamer classique de Lefty Kreh, imitant un poisson-appât — un profil élancé en plumes de sellier qui déplace l'eau et garde sa forme à la récupération. Conçu pour les prédateurs : achigan, brochet, et tout ce qui chasse le petit poisson.",
    descriptionEn:
      "Lefty Kreh's classic baitfish streamer — a slim saddle-hackle profile that pushes water and holds its shape on the strip. Built for predators: bass, pike, and anything that eats baitfish.",
    category: ProductCategory.STREAMER,
    basePriceCents: 500,
    images: ["/products/placeholder-fly.svg"],
    variants: [
      { nameFr: "Hameçon #2", nameEn: "Hook #2", sku: "LD-STD-02", stock: 15 },
      { nameFr: "Hameçon #1/0", nameEn: "Hook #1/0", sku: "LD-STD-10", stock: 12 },
    ],
  },
  {
    slug: "bead-head-hares-ear",
    nameFr: "Bead Head Hare's Ear",
    nameEn: "Bead Head Hare's Ear",
    descriptionFr:
      "La nymphe incontournable de toute boîte à mouches. Un corps en poil de lièvre naturel, texturé et duveteux, lesté d'une bille en laiton — une silhouette translucide qui imite une grande variété d'insectes aquatiques.",
    descriptionEn:
      "The workhorse nymph of the fly box. A buggy dubbed body from natural hare's mask with a brass bead for weight — a loose, translucent silhouette that passes for almost any subsurface insect.",
    category: ProductCategory.NYMPH,
    basePriceCents: 350,
    images: ["/products/placeholder-fly.svg"],
    variants: [
      { nameFr: "Hameçon #12", nameEn: "Hook #12", sku: "BHHE-STD-12", stock: 30 },
      { nameFr: "Hameçon #14", nameEn: "Hook #14", sku: "BHHE-STD-14", stock: 36 },
      { nameFr: "Hameçon #16", nameEn: "Hook #16", sku: "BHHE-STD-16", stock: 24 },
    ],
  },
  {
    slug: "woolly-bugger-black",
    nameFr: "Woolly Bugger Black",
    nameEn: "Woolly Bugger Black",
    descriptionFr:
      "Le Woolly Bugger noir, passe-partout par excellence — queue en marabout, hackle palmé, et assez de mouvement dans l'eau pour imiter une sangsue, une larve ou un poisson-appât selon la présentation. S'il ne fallait garder qu'une seule mouche, ce serait celle-ci.",
    descriptionEn:
      "The all-purpose black Woolly Bugger — marabou tail, palmered hackle, and enough movement in the water to imitate a leech, hellgrammite, or baitfish depending on how you fish it. If you carry only one fly, this is it.",
    category: ProductCategory.WET_FLY,
    basePriceCents: 375,
    images: ["/products/placeholder-fly.svg"],
    variants: [
      { nameFr: "Hameçon #6", nameEn: "Hook #6", sku: "WBB-STD-06", stock: 26 },
      { nameFr: "Hameçon #8", nameEn: "Hook #8", sku: "WBB-STD-08", stock: 32 },
      { nameFr: "Hameçon #10", nameEn: "Hook #10", sku: "WBB-STD-10", stock: 22 },
    ],
  },
];

async function main() {
  // The array above is the source of truth for the catalog — drop any product
  // left over from a previous seed run (old placeholders, discontinued
  // patterns, materials/tools/kits) that's no longer listed here.
  await prisma.product.deleteMany({
    where: { slug: { notIn: products.map((p) => p.slug) } },
  });

  for (const p of products) {
    const { variants, ...productData } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        ...productData,
        variants: {
          deleteMany: {},
          create: variants,
        },
      },
      create: {
        ...productData,
        variants: {
          create: variants,
        },
      },
    });
  }
  console.log(`Seeded ${products.length} products.`);

  // Demo reviews were removed deliberately: seeding invented customer
  // testimonials onto a live storefront is deceptive advertising. Reviews now
  // come only from signed-in accounts with a matching paid order.
  const removed = await prisma.review.deleteMany({
    where: { email: { endsWith: "@seed.la-moucherie.test" } },
  });
  if (removed.count > 0) {
    console.log(`Removed ${removed.count} leftover demo review(s).`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
