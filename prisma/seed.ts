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
    variants: [
      { nameFr: "Hameçon #2", nameEn: "Hook #2", sku: "CM-CHT-02", stock: 18 },
      { nameFr: "Hameçon #4", nameEn: "Hook #4", sku: "CM-CHT-04", stock: 20 },
    ],
  },
  {
    slug: "cape-de-coq-grizzly",
    nameFr: "Cape de coq Grizzly",
    nameEn: "Grizzly Rooster Cape",
    descriptionFr:
      "Cape de qualité supérieure aux fibres rigides et brillantes, essentielle pour le montage de mouches sèches.",
    descriptionEn:
      "A premium cape with stiff, glossy fibers, essential for tying dry flies.",
    category: ProductCategory.MATERIAL,
    basePriceCents: 4200,
    images: ["/products/placeholder-material.svg"],
    variants: [
      { nameFr: "Qualité Standard", nameEn: "Standard Grade", sku: "CAPE-GRZ-STD", stock: 10 },
      { nameFr: "Qualité Compétition", nameEn: "Competition Grade", priceCents: 6800, sku: "CAPE-GRZ-COMP", stock: 4 },
    ],
  },
  {
    slug: "poil-de-chevreuil-naturel",
    nameFr: "Poil de chevreuil naturel",
    nameEn: "Natural Deer Hair",
    descriptionFr:
      "Poil de chevreuil creux et flottant, parfait pour les têtes de Muddler et les corps d'insectes terrestres.",
    descriptionEn:
      "Hollow, buoyant deer hair, perfect for Muddler heads and terrestrial insect bodies.",
    category: ProductCategory.MATERIAL,
    basePriceCents: 950,
    images: ["/products/placeholder-material.svg"],
    variants: [
      { nameFr: "Paquet", nameEn: "Pack", sku: "HAIR-DEER-NAT", stock: 35 },
    ],
  },
  {
    slug: "bobineur-ceramique",
    nameFr: "Bobineur en céramique",
    nameEn: "Ceramic Bobbin Holder",
    descriptionFr:
      "Bobineur robuste à tube en céramique évitant l'effilochage du fil, tension réglable.",
    descriptionEn:
      "A sturdy bobbin holder with a ceramic tube to prevent thread fraying, adjustable tension.",
    category: ProductCategory.TOOL,
    basePriceCents: 1800,
    images: ["/products/placeholder-tool.svg"],
    variants: [{ nameFr: "Standard", nameEn: "Standard", sku: "TOOL-BOBBIN-CER", stock: 25 }],
  },
  {
    slug: "kit-debutant",
    nameFr: "Kit débutant — Montage de mouches",
    nameEn: "Beginner Fly Tying Kit",
    descriptionFr:
      "Tout ce qu'il faut pour commencer : outils essentiels, matériaux de base et 3 patrons classiques, accompagnés d'un guide bilingue.",
    descriptionEn:
      "Everything you need to get started: essential tools, core materials, and 3 classic patterns, with a bilingual guide.",
    category: ProductCategory.KIT,
    basePriceCents: 8900,
    images: ["/products/placeholder-kit.svg"],
    featured: true,
    variants: [{ nameFr: "Kit complet", nameEn: "Complete kit", sku: "KIT-BEGIN-01", stock: 12 }],
  },
];

async function main() {
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
