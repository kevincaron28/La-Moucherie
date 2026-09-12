import { PrismaClient, ProductCategory, ReviewStatus } from "@prisma/client";

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

const products: ProductSeed[] = [
  {
    slug: "wooly-bugger-olive",
    nameFr: "Wooly Bugger Olive",
    nameEn: "Olive Wooly Bugger",
    descriptionFr:
      "Un streamer polyvalent, monté à la main, imitant sangsues et petits poissons-appâts. Un incontournable pour la truite et l'omble dans les rivières du Québec.",
    descriptionEn:
      "A versatile, hand-tied streamer imitating leeches and baitfish. A must-have for trout and char in Québec rivers.",
    category: ProductCategory.STREAMER,
    basePriceCents: 375,
    images: ["/products/placeholder-fly.svg"],
    featured: true,
    variants: [
      { nameFr: "Hameçon #6", nameEn: "Hook #6", sku: "WB-OLV-06", stock: 24 },
      { nameFr: "Hameçon #8", nameEn: "Hook #8", sku: "WB-OLV-08", stock: 30 },
      { nameFr: "Hameçon #10", nameEn: "Hook #10", sku: "WB-OLV-10", stock: 18 },
    ],
  },
  {
    slug: "elk-hair-caddis",
    nameFr: "Elk Hair Caddis",
    nameEn: "Elk Hair Caddis",
    descriptionFr:
      "Mouche sèche classique flottant haut, idéale pour imiter les caddis adultes lors des éclosions du soir.",
    descriptionEn:
      "A classic high-floating dry fly, ideal for imitating adult caddisflies during evening hatches.",
    category: ProductCategory.DRY_FLY,
    basePriceCents: 350,
    images: ["/products/placeholder-fly.svg"],
    featured: true,
    variants: [
      { nameFr: "Hameçon #12", nameEn: "Hook #12", sku: "EHC-STD-12", stock: 40 },
      { nameFr: "Hameçon #14", nameEn: "Hook #14", sku: "EHC-STD-14", stock: 45 },
      { nameFr: "Hameçon #16", nameEn: "Hook #16", sku: "EHC-STD-16", stock: 22 },
    ],
  },
  {
    slug: "pheasant-tail-nymph",
    nameFr: "Nymphe Pheasant Tail",
    nameEn: "Pheasant Tail Nymph",
    descriptionFr:
      "Nymphe discrète et efficace imitant une grande variété d'éphémères. Un choix sûr pour la pêche en eau vive.",
    descriptionEn:
      "A subtle and effective nymph imitating a wide range of mayflies. A safe bet for fast-water fishing.",
    category: ProductCategory.NYMPH,
    basePriceCents: 325,
    images: ["/products/placeholder-fly.svg"],
    variants: [
      { nameFr: "Hameçon #14", nameEn: "Hook #14", sku: "PTN-STD-14", stock: 50 },
      { nameFr: "Hameçon #16", nameEn: "Hook #16", sku: "PTN-STD-16", stock: 38 },
    ],
  },
  {
    slug: "royal-wulff",
    nameFr: "Royal Wulff",
    nameEn: "Royal Wulff",
    descriptionFr:
      "Mouche sèche voyante et flottante, parfaite pour repérer sa dérive dans les eaux turbulentes.",
    descriptionEn:
      "A bold, buoyant dry fly, perfect for tracking your drift in turbulent water.",
    category: ProductCategory.DRY_FLY,
    basePriceCents: 375,
    images: ["/products/placeholder-fly.svg"],
    variants: [
      { nameFr: "Hameçon #10", nameEn: "Hook #10", sku: "RW-STD-10", stock: 20 },
      { nameFr: "Hameçon #12", nameEn: "Hook #12", sku: "RW-STD-12", stock: 28 },
    ],
  },
  {
    slug: "muddler-minnow",
    nameFr: "Muddler Minnow",
    nameEn: "Muddler Minnow",
    descriptionFr:
      "Streamer intemporel à tête en poil de chevreuil, redoutable pour la truite grise et l'achigan.",
    descriptionEn:
      "A timeless deer-hair-head streamer, deadly for lake trout and smallmouth bass.",
    category: ProductCategory.STREAMER,
    basePriceCents: 400,
    images: ["/products/placeholder-fly.svg"],
    variants: [
      { nameFr: "Hameçon #4", nameEn: "Hook #4", sku: "MM-STD-04", stock: 15 },
      { nameFr: "Hameçon #6", nameEn: "Hook #6", sku: "MM-STD-06", stock: 22 },
    ],
  },
  {
    slug: "prince-nymph",
    nameFr: "Nymphe Prince",
    nameEn: "Prince Nymph",
    descriptionFr:
      "Nymphe attractive aux ailes blanches en biots, excellente en tandem ou en tête de cortège.",
    descriptionEn:
      "An attractor nymph with white biot wings, excellent fished in tandem or as a point fly.",
    category: ProductCategory.NYMPH,
    basePriceCents: 325,
    images: ["/products/placeholder-fly.svg"],
    variants: [
      { nameFr: "Hameçon #12", nameEn: "Hook #12", sku: "PN-STD-12", stock: 26 },
      { nameFr: "Hameçon #14", nameEn: "Hook #14", sku: "PN-STD-14", stock: 32 },
    ],
  },
  {
    slug: "griffiths-gnat",
    nameFr: "Griffith's Gnat",
    nameEn: "Griffith's Gnat",
    descriptionFr:
      "Minuscule mouche sèche imitant les chironomes en grappe, parfaite pour les truites difficiles en eau plate.",
    descriptionEn:
      "A tiny dry fly imitating clustered midges, perfect for selective trout in flat water.",
    category: ProductCategory.DRY_FLY,
    basePriceCents: 300,
    images: ["/products/placeholder-fly.svg"],
    variants: [
      { nameFr: "Hameçon #18", nameEn: "Hook #18", sku: "GG-STD-18", stock: 40 },
      { nameFr: "Hameçon #20", nameEn: "Hook #20", sku: "GG-STD-20", stock: 34 },
    ],
  },
  {
    slug: "clouser-minnow-chartreuse",
    nameFr: "Clouser Minnow Chartreuse",
    nameEn: "Chartreuse Clouser Minnow",
    descriptionFr:
      "Streamer lesté aux yeux haltères, un classique pour l'achigan et le doré en lac.",
    descriptionEn:
      "A dumbbell-eyed weighted streamer, a classic for bass and walleye on the lake.",
    category: ProductCategory.STREAMER,
    basePriceCents: 425,
    images: ["/products/placeholder-fly.svg"],
    featured: true,
    variants: [
      { nameFr: "Hameçon #2", nameEn: "Hook #2", sku: "CM-CHT-02", stock: 18 },
      { nameFr: "Hameçon #4", nameEn: "Hook #4", sku: "CM-CHT-04", stock: 20 },
    ],
  },
];

async function main() {
  // Materials/tools/kits are on hold for now (team supplier agreement) — drop any
  // leftover seed products from those categories so re-running the seed cleans them up.
  await prisma.product.deleteMany({
    where: { category: { in: ["MATERIAL", "TOOL", "KIT"] } },
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

  const SEED_REVIEW_DOMAIN = "@seed.la-moucherie.test";
  await prisma.review.deleteMany({ where: { email: { endsWith: SEED_REVIEW_DOMAIN } } });

  const reviewsBySlug: Record<
    string,
    {
      customerName: string;
      email: string;
      rating: number;
      title: string;
      body: string;
      locale: string;
      verifiedPurchase: boolean;
      status: ReviewStatus;
    }[]
  > = {
    "wooly-bugger-olive": [
      {
        customerName: "Marc-Antoine T.",
        email: `marc-antoine${SEED_REVIEW_DOMAIN}`,
        rating: 5,
        title: "Efficace sur la rivière Sainte-Marguerite",
        body: "Monture solide, les fibres bougent bien dans le courant. J'en ai pris trois belles truites avec la même mouche.",
        locale: "fr",
        verifiedPurchase: true,
        status: ReviewStatus.APPROVED,
      },
      {
        customerName: "Sarah K.",
        email: `sarah.k${SEED_REVIEW_DOMAIN}`,
        rating: 4,
        title: "Great action in the water",
        body: "Well tied, the marabou has a lot of movement. Shipping was fast too.",
        locale: "en",
        verifiedPurchase: true,
        status: ReviewStatus.APPROVED,
      },
      {
        customerName: "Julien P.",
        email: `julien.p${SEED_REVIEW_DOMAIN}`,
        rating: 5,
        title: "Ma préférée pour l'omble",
        body: "Toujours dans ma boîte à mouches. Bonne tenue après plusieurs sorties.",
        locale: "fr",
        verifiedPurchase: false,
        status: ReviewStatus.PENDING,
      },
    ],
    "elk-hair-caddis": [
      {
        customerName: "Chantal L.",
        email: `chantal.l${SEED_REVIEW_DOMAIN}`,
        rating: 5,
        title: "Flotte parfaitement",
        body: "Exactement ce qu'il fallait pour l'éclosion du soir. Le poil de chevreuil garde bien sa flottaison.",
        locale: "fr",
        verifiedPurchase: true,
        status: ReviewStatus.APPROVED,
      },
      {
        customerName: "David R.",
        email: `david.r${SEED_REVIEW_DOMAIN}`,
        rating: 4,
        title: "Solid classic pattern",
        body: "Good proportions, held up well over a full weekend on the water.",
        locale: "en",
        verifiedPurchase: false,
        status: ReviewStatus.APPROVED,
      },
    ],
  };

  let reviewCount = 0;
  for (const [slug, reviews] of Object.entries(reviewsBySlug)) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) continue;
    for (const review of reviews) {
      await prisma.review.create({ data: { ...review, productId: product.id } });
      reviewCount += 1;
    }
  }
  console.log(`Seeded ${reviewCount} reviews.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
